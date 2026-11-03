# Connect over Tailscale and standard SSH

Confirm customer consent, the specific machine, expected tailnet, support username, and approved work from external inventory. The wrapper needs Bash, Python 3.9+, the Tailscale CLI, OpenSSH `ssh`, and `ssh-keygen` on the agent host. It has no repository, inventory script, configuration file, or secrets-provider dependency.

## Prepare outside the skill

1. The host-managed secure mechanism supplies an approved temporary identity file owned by the current user with mode `0600` or `0400`. Use an absolute path. Do not print, inspect through chat, or retrieve the private key through a tool returning secret values. The wrapper does not copy, chmod, delete, or retrieve it. If the credential workflow uses an encrypted key, arrange the approved unlock mechanism beforehand; batch mode will not prompt.
2. Read `tailscale status --json` locally and compare `CurrentTailnet.Name` with the expected network in approved inventory. Do not dump the customer inventory into chat. If Tailscale is unavailable, offline, or on another network, stop. Switching networks requires separate approval.
3. Get the machine's SSH host-key fingerprint through a trusted owner-controlled channel. Install the verified host public key under its full overlay DNS name (without a trailing dot) in an owner-controlled known-hosts file. `ssh-keyscan` alone is not identity verification. Never use `accept-new`, `StrictHostKeyChecking=no`, or automatically replace a changed key.

## Run the wrapper

From the skill directory, substitute values supplied at runtime:

```bash
<support-skill-directory>/scripts/ssh-session.sh \
  --host "$APPROVED_OVERLAY_HOST" \
  --user "$APPROVED_SUPPORT_USER" \
  --tailnet "$EXPECTED_TAILNET" \
  --identity-file "$APPROVED_TEMPORARY_KEY_PATH" \
  --known-hosts "$VERIFIED_KNOWN_HOSTS_PATH" \
  -- whoami
```

Omit `--` and the command for a session. `--known-hosts` defaults to `~/.ssh/known_hosts`; an explicit isolated file is preferable. Do not pass SSH options after `--`: those arguments are the approved remote command, which the remote shell interprets. Review command quoting for the target OS and never put credentials in the command.

The wrapper requires a running Tailscale backend, a nonblank matching current tailnet, and exactly one online peer matching the full or short overlay DNS name. It rejects IP literals, aliases not present in live peer DNS data, offline peers, and non-Tailscale addresses. It pings the selected overlay IP and SSHes that IP using the canonical DNS name as `HostKeyAlias`, avoiding a separate DNS lookup.

SSH ignores user/system SSH configuration (`-F /dev/null`), uses only the supplied identity, disables password and keyboard-interactive authentication, and enables batch mode. Agent forwarding and configured port forwards are disabled. `StrictHostKeyChecking=yes`, a required known-host entry, and disabled automatic host-key updates mean unknown or changed keys stop the session. Tailscale ACLs and peer firewall policy still govern access; membership alone is not authorization.

## Failures and completion

If membership or ping fails, inspect the approved machine's Tailscale state with its owner; do not guess addresses or try another network. If the host key changes, stop and verify the change out of band before the owner updates known hosts. Do not bypass the wrapper's checks to make a connection work.

After connecting, confirm `whoami` and `hostname` before diagnosis. A successful SSH login is not proof that onboarding or firewall isolation is complete. Report findings without credentials and have the credential owner remove the approved temporary file through the host-managed lifecycle; the wrapper leaves it intact on success, failure, and interruption.

## Local mock smoke checks

From the skill directory:

```bash
bash -n <support-skill-directory>/scripts/ssh-session.sh
python3 <support-skill-directory>/scripts/test-ssh-session.py
```

The tests substitute mock Tailscale, SSH, and host-key lookup executables in a temporary directory. They do not contact or mutate a live PC or change the host's Tailscale state. They cover required arguments, tailnet/backend/peer checks, offline and ambiguous peers, overlay addresses, host-key lookup failure, ping failure, identity permissions, key preservation, strict SSH options, stdin preservation, SSH exit status, and runtime public-key format validation. Mock success does not certify real firewall isolation, host-key correctness, or onboarding.
