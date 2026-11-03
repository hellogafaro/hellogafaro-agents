#!/usr/bin/env bash
set -euo pipefail
exec python3 -c "$(cat <<'PY'
import argparse
import ipaddress
import json
import os
from pathlib import Path
import re
import shutil
import stat
import subprocess
import sys


def fail(message):
    print(f"ssh-session.sh: {message}", file=sys.stderr)
    raise SystemExit(1)


parser = argparse.ArgumentParser(description="Approved Tailscale peer SSH using a supplied temporary identity.")
parser.add_argument("--host", required=True)
parser.add_argument("--user", required=True)
parser.add_argument("--tailnet", required=True)
parser.add_argument("--identity-file", required=True)
parser.add_argument("--known-hosts", default=str(Path.home() / ".ssh" / "known_hosts"))
arguments = sys.argv[1:]
separator = arguments.index("--") if "--" in arguments else len(arguments)
args = parser.parse_args(arguments[:separator])
remote_command = arguments[separator + 1:] if separator < len(arguments) else []
host = args.host.rstrip(".").lower()
if len(host) > 253 or not re.fullmatch(r"[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)*", host):
    fail("supply an approved overlay DNS name")
try:
    ipaddress.ip_address(host)
except ValueError:
    pass
else:
    fail("IP literals are not accepted; supply the approved overlay DNS name")
if not re.fullmatch(r"[A-Za-z_][A-Za-z0-9_.-]*", args.user):
    fail("invalid support username")
if not args.tailnet or args.tailnet != args.tailnet.strip():
    fail("an explicit nonblank expected tailnet is required")
for executable in ("tailscale", "ssh", "ssh-keygen"):
    if not shutil.which(executable):
        fail(f"{executable} is not on PATH")

identity = Path(args.identity_file)
if not identity.is_absolute():
    fail("identity-file must be an absolute approved temporary path")
try:
    metadata = identity.lstat()
except OSError:
    fail("identity-file is unavailable")
if not stat.S_ISREG(metadata.st_mode) or metadata.st_uid != os.getuid() or stat.S_IMODE(metadata.st_mode) not in (0o400, 0o600) or metadata.st_size == 0:
    fail("identity-file must be a nonempty regular file owned by this user with mode 0400 or 0600")
known_hosts = Path(args.known_hosts)
if not known_hosts.is_absolute() or not known_hosts.is_file() or not os.access(known_hosts, os.R_OK):
    fail("known-hosts must be an absolute readable existing file with a verified host key")
if any(character in str(known_hosts) for character in ('"', '\\', '\n', '\r')):
    fail("known-hosts path contains unsupported configuration characters")

try:
    status_result = subprocess.run(["tailscale", "status", "--json"], capture_output=True, text=True, timeout=20, check=True)
    status = json.loads(status_result.stdout)
    current_tailnet = (status.get("CurrentTailnet") or {}).get("Name")
    if status.get("BackendState") != "Running" or not current_tailnet:
        fail("Tailscale is not running on a known tailnet")
    if current_tailnet.casefold() != args.tailnet.casefold():
        fail("current tailnet does not match the approved expected tailnet; stop and ask")
    peers = status.get("Peer") or {}
    matches = []
    for peer in peers.values():
        dns_name = (peer.get("DNSName") or "").rstrip(".").lower()
        if dns_name and host in (dns_name, dns_name.split(".")[0]):
            matches.append((dns_name, peer))
    if len(matches) != 1:
        fail("approved host is missing or ambiguous in live Tailscale peer DNS membership")
    canonical, peer = matches[0]
    if peer.get("Online") is not True:
        fail("approved peer is offline")
    if not re.fullmatch(r"[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)*", canonical):
        fail("peer DNS name is invalid")
    addresses = [ipaddress.ip_address(value) for value in peer.get("TailscaleIPs", [])]
    overlay_ranges = (ipaddress.ip_network("100.64.0.0/10"), ipaddress.ip_network("fd7a:115c:a1e0::/48"))
    if not addresses or any(not any(address in network for network in overlay_ranges) for address in addresses):
        fail("peer has missing or non-Tailscale addresses")
    address = str(sorted(addresses, key=lambda value: value.version)[0])
except (OSError, subprocess.SubprocessError, ValueError, TypeError, AttributeError):
    fail("unable to verify live Tailscale status")

try:
    lookup = subprocess.run(["ssh-keygen", "-F", canonical, "-f", str(known_hosts)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=10)
    if lookup.returncode != 0:
        fail("no verified canonical host entry in known-hosts; verify the fingerprint out of band")
    ping = subprocess.run(["tailscale", "ping", "--c", "1", "--until-direct=false", address], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=30)
    if ping.returncode != 0:
        fail("Tailscale ping failed; no SSH attempted")
except (OSError, subprocess.SubprocessError):
    fail("host-key lookup or Tailscale ping could not complete")

command = ["ssh", "-F", "/dev/null", "-p", "22", "-i", str(identity), "-l", args.user]
for option in (
    "IdentitiesOnly=yes", "IdentityAgent=none", "PreferredAuthentications=publickey",
    "PasswordAuthentication=no", "KbdInteractiveAuthentication=no", "BatchMode=yes",
    "StrictHostKeyChecking=yes", f'UserKnownHostsFile="{known_hosts}"', "GlobalKnownHostsFile=/dev/null",
    f"HostKeyAlias={canonical}", "UpdateHostKeys=no", "VerifyHostKeyDNS=no",
    "CanonicalizeHostname=no", "ProxyCommand=none", "ProxyJump=none", "ForwardAgent=no",
    "ClearAllForwardings=yes", "PermitLocalCommand=no", "ConnectionAttempts=1", "ConnectTimeout=15",
):
    command.extend(["-o", option])
command.extend([address, *remote_command])
try:
    os.execvp("ssh", command)
except OSError:
    fail("could not start SSH")
PY
)" "$@"
