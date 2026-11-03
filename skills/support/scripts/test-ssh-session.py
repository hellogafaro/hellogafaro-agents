#!/usr/bin/env python3
import base64
import json
import os
from pathlib import Path
import shutil
import struct
import subprocess
import tempfile
import unittest


HERE = Path(__file__).resolve().parent
MOCK = '''#!/usr/bin/env python3
import json, os, sys
from pathlib import Path
name = Path(sys.argv[0]).name
with open(os.environ["MOCK_LOG"], "a") as stream:
    stream.write(json.dumps([name, *sys.argv[1:]]) + "\\n")
if name == "tailscale" and sys.argv[1:3] == ["status", "--json"]:
    print(os.environ["MOCK_STATUS"])
    sys.exit(int(os.environ.get("MOCK_STATUS_EXIT", "0")))
if name == "tailscale":
    sys.exit(int(os.environ.get("MOCK_PING_EXIT", "0")))
if name == "ssh-keygen":
    sys.exit(int(os.environ.get("MOCK_KEY_EXIT", "0")))
if name == "ssh":
    with open(os.environ["MOCK_INPUT"], "w") as stream:
        stream.write(sys.stdin.read())
    sys.exit(int(os.environ.get("MOCK_SSH_EXIT", "0")))
sys.exit(99)
'''


class WrapperTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory(prefix="remote-support-mock-")
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.bin = self.root / "bin"
        self.bin.mkdir()
        for name in ("tailscale", "ssh", "ssh-keygen"):
            path = self.bin / name
            path.write_text(MOCK)
            path.chmod(0o700)
        self.key = self.root / "identity"
        self.key.write_text("mock identity sentinel, not a private key\n")
        self.key.chmod(0o600)
        self.known = self.root / "known hosts"
        self.known.write_text("mock known host, not an actual host key\n")
        self.status = {"BackendState": "Running", "CurrentTailnet": {"Name": "approved.test"}, "Peer": {
            "peer": {"DNSName": "support-node.approved.test.", "Online": True, "TailscaleIPs": ["100.64.0.7"]}
        }}
        self.environment = {**os.environ, "PATH": str(self.bin) + os.pathsep + os.environ["PATH"],
                            "MOCK_LOG": str(self.root / "calls"), "MOCK_INPUT": str(self.root / "input")}

    def run_wrapper(self, extra=None, overrides=None):
        self.environment["MOCK_STATUS"] = json.dumps(self.status)
        result = subprocess.run([shutil.which("bash"), str(HERE / "ssh-session.sh"),
                                 "--host", "support-node", "--user", "admin", "--tailnet", "approved.test",
                                 "--identity-file", str(self.key), "--known-hosts", str(self.known),
                                 *(extra or [])], env={**self.environment, **(overrides or {})},
                                input="session stdin is preserved\n", text=True, capture_output=True, timeout=10)
        self.assertTrue(self.key.exists())
        self.assertEqual(self.key.read_text(), "mock identity sentinel, not a private key\n")
        self.assertNotIn("mock identity sentinel", result.stdout + result.stderr)
        log = self.root / "calls"
        return result, [json.loads(line) for line in log.read_text().splitlines()] if log.exists() else []

    def assert_stopped(self, result, calls):
        self.assertNotEqual(result.returncode, 0)
        self.assertFalse(any(call[0] == "ssh" for call in calls))

    def test_success_and_strict_arguments(self):
        result, calls = self.run_wrapper(["--", "whoami"])
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual([call[0] for call in calls], ["tailscale", "ssh-keygen", "tailscale", "ssh"])
        command = calls[-1]
        for option in ("StrictHostKeyChecking=yes", "PasswordAuthentication=no", "KbdInteractiveAuthentication=no",
                       "BatchMode=yes", "IdentitiesOnly=yes", "ForwardAgent=no", "IdentityAgent=none",
                       "ClearAllForwardings=yes", "UpdateHostKeys=no", "HostKeyAlias=support-node.approved.test",
                       f'UserKnownHostsFile="{self.known}"'):
            self.assertIn(option, command)
        self.assertIn("/dev/null", command)
        self.assertEqual(command[-2:], ["100.64.0.7", "whoami"])
        self.assertEqual(calls[2][-1], "100.64.0.7")
        self.assertEqual((self.root / "input").read_text(), "session stdin is preserved\n")

    def test_wrong_tailnet(self):
        self.status["CurrentTailnet"]["Name"] = "other.test"
        self.assert_stopped(*self.run_wrapper())

    def test_blank_tailnet(self):
        self.status["CurrentTailnet"]["Name"] = ""
        self.assert_stopped(*self.run_wrapper())

    def test_backend_stopped(self):
        self.status["BackendState"] = "Stopped"
        self.assert_stopped(*self.run_wrapper())

    def test_missing_peer(self):
        self.status["Peer"] = {}
        self.assert_stopped(*self.run_wrapper())

    def test_ambiguous_short_name(self):
        self.status["Peer"]["second"] = {"DNSName": "support-node.other.test.", "Online": True, "TailscaleIPs": ["100.64.0.8"]}
        self.assert_stopped(*self.run_wrapper())

    def test_offline_peer(self):
        self.status["Peer"]["peer"]["Online"] = False
        self.assert_stopped(*self.run_wrapper())

    def test_public_address(self):
        self.status["Peer"]["peer"]["TailscaleIPs"] = ["192.0.2.8"]
        self.assert_stopped(*self.run_wrapper())

    def test_ipv6_overlay(self):
        self.status["Peer"]["peer"]["TailscaleIPs"] = ["fd7a:115c:a1e0::7"]
        result, calls = self.run_wrapper()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(calls[-1][-1], "fd7a:115c:a1e0::7")

    def test_unknown_host_key(self):
        self.assert_stopped(*self.run_wrapper(overrides={"MOCK_KEY_EXIT": "1"}))

    def test_failed_ping(self):
        self.assert_stopped(*self.run_wrapper(overrides={"MOCK_PING_EXIT": "1"}))

    def test_failed_status(self):
        self.assert_stopped(*self.run_wrapper(overrides={"MOCK_STATUS_EXIT": "1"}))

    def test_insecure_identity_permissions(self):
        self.key.chmod(0o644)
        self.assert_stopped(*self.run_wrapper())

    def test_identity_symlink(self):
        real = self.root / "real"
        self.key.rename(real)
        self.key.symlink_to(real)
        self.assert_stopped(*self.run_wrapper())

    def test_missing_known_hosts(self):
        self.known.unlink()
        self.assert_stopped(*self.run_wrapper())

    def test_ssh_exit_propagated_key_preserved(self):
        result, _ = self.run_wrapper(overrides={"MOCK_SSH_EXIT": "255"})
        self.assertEqual(result.returncode, 255)

    def test_no_implicit_required_arguments(self):
        result = subprocess.run([shutil.which("bash"), str(HERE / "ssh-session.sh")], capture_output=True)
        self.assertNotEqual(result.returncode, 0)

    def test_public_key_validation(self):
        public = self.root / "runtime.pub"
        wire = struct.pack(">I", 11) + b"ssh-ed25519" + struct.pack(">I", 32) + os.urandom(32)
        line = "ssh-ed25519 " + base64.b64encode(wire).decode() + " runtime-test"
        for text, expected in ((line, 0), ("bad", 1), (line + "\n" + line, 1), ("command=anything " + line, 1)):
            public.write_text(text)
            result = subprocess.run([shutil.which("python3"), str(HERE / "validate-public-key.py"), str(public)], capture_output=True, text=True)
            self.assertEqual(result.returncode, expected)
            self.assertNotIn(base64.b64encode(wire).decode(), result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main(verbosity=2)
