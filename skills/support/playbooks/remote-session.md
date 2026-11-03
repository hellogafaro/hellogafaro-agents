### Remote session

Use the approved customer network and standard SSH to reach only the agreed machine. Do not expose it to the internet, configure router port forwards, use public or LAN SSH, RDP, Tailscale SSH, Screen Sharing, or add other inbound services for this work.

This playbook is reusable guidance, not permission to change a machine. Confirm the customer's consent, target, support task, and permitted changes before connecting. Read-only diagnosis comes first; permission to investigate does not authorize onboarding, account or firewall changes, deleting data, or disrupting services.

## Choose the reference

- [Connect](../references/remote/connect.md) before any SSH session.
- [Windows standard](../references/remote/windows-standard.md) for the target access model and approval checklist.
- [Onboard Windows](../references/remote/onboard-windows.md) or [onboard macOS](../references/remote/onboard-macos.md) for a reviewed onboarding plan, not an unattended bootstrap.
- [Support work](../references/remote/support-work.md) for printer, cleanup, and service diagnostics.

## Environment and credentials

Keep customer-specific inventory outside this skill in the owner's approved system. Resolve the customer, exact expected Tailscale `CurrentTailnet.Name`, approved overlay DNS name, OS, support username, owner, and authorization there. A short overlay name may differ from the OS name; record the verified mapping. Missing, blank, ambiguous, or mismatched information means stop and ask. Never guess a target, fall back to public/LAN DNS, or switch tailnets without approval.

The host's secure credential mechanism supplies an approved temporary private-key file outside this skill. No particular secret provider is required. Never retrieve secret values into tool results, logs, or chat. Do not embed keys, passwords, account IDs, or customer inventory in the skill. Key scope, rotation, and human password access are owner policy; do not mint per-machine keys or passwords as a troubleshooting workaround.

Use `<support-skill-directory>/scripts/ssh-session.sh` with explicit `--host`, `--user`, `--tailnet`, and `--identity-file`. It verifies live Tailscale membership and reachability, connects to the verified peer's overlay IP, and requires a previously verified SSH host key. It neither retrieves nor deletes the supplied key. The credential owner handles its secure cleanup after the session.

## Session flow

1. Resolve the agreed target and network from external inventory. Confirm scope and consent.
2. Obtain the approved temporary key through the host-managed secure mechanism and verify the host-key fingerprint through a trusted owner-controlled channel.
3. Connect using [connect](../references/remote/connect.md). Stop on network, membership, ping, or host-key failures; do not relax checks.
4. Confirm remote identity, inspect the issue, then perform only the smallest approved fix. Stay on that machine.
5. Report the target, findings, exact changes, verification, and any remaining reboot or owner action. Arrange temporary credential cleanup with its owner.

## Hard limits

- No unrelated user changes, automated password resets, user deletion, profile wipes, disk formatting, or unattended reboot.
- Onboarding requires explicit approval for each security-sensitive stage: account privileges/hiding, SSH installation and configuration, public-key installation and ACLs, firewall policy, naming, and service restart. Broad access approval is not blanket permission.
- Use an owner-approved strong password when creating a support account. An existing unrelated `admin` belongs to its owner; inspect and stop rather than reset, hide, enable, or repurpose it.
- Never pass a password to SSH or use `sshpass`. The wrapper uses public-key authentication only.
- Job cancellation, spooler/service restart, cleanup (including recycle bin), printer/driver removal, vendor installs, and reboot need consent appropriate to their data-loss or interruption impact.
