# Onboard a Mac

This is a reviewed SSH-only onboarding runbook, not the source's privileged paste-and-run bootstrap. The source also enabled Screen Sharing, passwordless sudo, persistent pf reloads, and deleted legacy accounts. Those actions are omitted: they are outside the support scope or need a separate reviewed, explicitly approved change. No live Mac onboarding is claimed.

## Consent and inspect

Resolve the owner-approved machine, exact expected tailnet, overlay DNS name, support account, and public-key fingerprint from external inventory. Obtain approval for the proposed account privileges/hiding, Remote Login access list, key installation, firewall changes, and service interruption. Inventory and credential-provider routing remain outside the skill. Install and sign in to the approved Tailscale network only with owner consent. Changing its hostname or disabling device-key expiry requires separate approval; leave the Mac's computer name alone by default.

Before changes, inspect macOS version, existing accounts, support-account ownership, Remote Login settings and allowed users, existing SSH configuration, pf state/anchors, endpoint policy, and recovery access. Use read-only commands such as:

```bash
sw_vers
hostname
id "$APPROVED_SUPPORT_USER"
dscl . -read "/Users/$APPROVED_SUPPORT_USER" Comment NFSHomeDirectory IsHidden
sudo systemsetup -getremotelogin
sudo pfctl -s info
sudo pfctl -sr
```

Use elevated inspection only with permission. Existing SSH/security settings may be managed by MDM; stop and ask rather than override them. Save a recoverable snapshot of the relevant settings before approved changes.

## Account and public key

A local support account may be created with owner-approved administrator rights and an owner-approved strong unique password, entered and confirmed securely and stored by the owner through the host-managed credential mechanism. Do not put passwords in chat, shell history, scripts, or process arguments. Prefer the owner's local account-management interface or an approved secure management workflow rather than a bootstrap that passes plaintext passwords to `sysadminctl`.

The name `admin` is conventional, not proof of ownership. Stop if an existing account is unrelated or its ownership is uncertain. For a verified support-owned account, preserve the password. Account hiding and admin-group membership require explicit consent; hiding does not make access secure. Inspect legacy accounts and their dependencies only if relevant; never delete users, home directories, or existing sudoers files through this runbook.

Supply a public key at runtime; no key is bundled. On the support host:

```bash
python3 <support-skill-directory>/scripts/validate-public-key.py "$APPROVED_PUBLIC_KEY_FILE"
ssh-keygen -lf "$APPROVED_PUBLIC_KEY_FILE"
```

Verify the fingerprint with the owner through a trusted channel, then transfer only that validated public key. On the Mac, validate the transferred file and fingerprint using `ssh-keygen -lf <approved-public-key-file>` before installation. Add it to the approved account's configured `authorized_keys`, preserving unrelated keys. Verify the account's actual home directory; do not infer a path from its name. With approval, ensure `.ssh` is owned by that account with mode `0700`, and `authorized_keys` is owned by it with mode `0600`. Do not replace existing SSH configuration blindly. Use key-only agent authentication; no `NOPASSWD: ALL` sudo grant is made or required. Privileged fixes need a separately approved elevation mechanism.

## Remote Login and network isolation

Enable standard Remote Login (SSH) only after its access restrictions and firewall plan are approved. If it was disabled, limit access to the approved support user. If already enabled, inspect and preserve the owner's allowed users; add the support user only with consent. Review configuration and `Match` blocks and validate proposed configuration before restarting any service. Do not enable Screen Sharing, RDP, other services, or broad full-disk access for this SSH support workflow. Full disk access is a separate, explicit security decision when a named task genuinely requires it.

SSH TCP 22 must be reachable only over the approved Tailscale network, not the LAN/public internet. Allowed Tailscale ranges are `100.64.0.0/10` and `fd7a:115c:a1e0::/48`. Review the Mac's actual pf/MDM/endpoint policy and rule ordering before proposing a narrowly scoped SSH rule. A standalone anchor is not proof of enforcement: inspect whether the active ruleset invokes it and whether earlier quick rules override it. Keep loopback/local recovery behavior as agreed. Do not overwrite `/etc/pf.conf`, flush global rules, enable pf, or install a recurring root LaunchDaemon as an implicit side effect. Persistence, anchor names, deployment, and rollback must be an owner-reviewed machine-specific plan outside the skill. If isolation cannot be verified, stop rather than advertise Tailscale-only access.

## Verify and finish

Record the verified overlay-name/OS-name mapping and support username in external inventory. Obtain and independently verify the SSH host-key fingerprint before populating known hosts. Follow [connect.md](connect.md), then check `whoami`, `hostname`, and `sw_vers`. Verify the approved account/key permissions, allowed Remote Login users, and effective IPv4/IPv6 source restrictions through owner-approved tests. Do not run `sudo -n true` as a blanket full-rights requirement or claim a pf rule works just because it parses.

Report completed changes and limitations. A Mac using a login-started Tailscale app may be unavailable until someone logs in after boot; FileVault can require a local unlock after reboot. Inspect the actual installation and do not change FileVault, sleep, login behavior, or reboot without consent. Roll back only the specific approved changes using the preserved state and owner-reviewed plan, never a generic account deletion or global firewall flush.
