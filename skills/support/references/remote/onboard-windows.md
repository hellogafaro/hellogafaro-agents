# Onboard a Windows PC

This is an approval-gated adaptation, not a paste-and-run bootstrap. It retains the source's support-account, OpenSSH, key/ACL, firewall, optional naming, and verification stages. No machine has been onboarded by preparing this document.

## Consent and preflight

The owner must approve the target, tailnet, support username, key fingerprint, administrator privileges, account hiding/expiry policy, SSH installation/default shell, firewall changes, service restart, and any rename. Confirm an outage window and rollback route before security changes; stages are not transactional and a later failure does not undo earlier changes. Record environment-specific inventory outside the skill.

Have the owner install Tailscale and sign in to the customer's existing network. Do not install, log in, change networks, or alter key-expiry policy without separate approval. Inspect in elevated PowerShell:

```powershell
Get-CimInstance Win32_ComputerSystem | Select-Object Name, DomainRole, PartOfDomain
Get-LocalUser
Get-Service sshd, MpsSvc -ErrorAction SilentlyContinue
Get-NetFirewallProfile -PolicyStore ActiveStore
```

Domain controllers need a separate procedure. A domain-joined PC can keep its name; a rename needs domain-specific review. Default to preserving Windows and Tailscale names, even when different. An approved replacement Windows name must be 1–15 letters, numbers, or hyphens, not all numeric, and not start/end with a hyphen. Confirm it twice, inspect server/service dependencies, and verify the Tailscale CLI before either rename. A Windows rename may require a later, explicitly scheduled restart; never reboot automatically.

## Runtime public key

Supply an owner-approved public key at runtime from the secure credential workflow; there is no default or bundled key. On the support host, before transferring only the public key:

```bash
python3 <support-skill-directory>/scripts/validate-public-key.py "$APPROVED_PUBLIC_KEY_FILE"
ssh-keygen -lf "$APPROVED_PUBLIC_KEY_FILE"
```

The validator accepts one structurally valid Ed25519 public key, with an optional comment and no authorized-key options. Match the fingerprint through a trusted owner-controlled channel. Format validation alone does not establish ownership. On Windows, use an approved local public-key file, not a private key, and verify again with the installed OpenSSH `ssh-keygen.exe -lf <approved-public-key-file>`. Stop if the supplied material is invalid or the fingerprint does not match. Do not fall back to an embedded key.

## Support account

The conventional name `admin` is not evidence that an existing account belongs to support. If it exists, inspect its ownership, enabled status, group membership, and any service/task dependencies before proposing changes:

```powershell
$SupportUser = Read-Host 'Approved support username'
$account = Get-LocalUser -Name $SupportUser -ErrorAction SilentlyContinue
$account
Get-CimInstance Win32_Service | Select-Object Name, StartName
Get-ScheduledTask | Select-Object TaskName, @{Name='UserId';Expression={$_.Principal.UserId}}
```

Stop on an unrelated or uncertain existing account. Never automatically reset its password, hide, enable, or repurpose it. For a verified support-owned existing account, preserve the password; a reset is a separate owner-approved operation requiring dependency review. Create a new account only with an owner-approved strong unique password entered twice through masked secure prompts and saved by the owner in the approved credential store, never chat or a command argument. Do not use a default password. Apply local Administrators membership, hiding via `SpecialAccounts\UserList`, or nonexpiring-password policy only if those changes were explicitly approved. Leave all other users alone.

## OpenSSH and firewall

Inspect the installed SSH service first. A working service does not need a Windows capability scan. If installation is approved, use Microsoft OpenSSH Server capability `OpenSSH.Server~~~~0.0.1.0`; Windows servicing may take minutes. A matching owner-supplied Features on Demand directory may replace a Windows Update download. Monitor progress and any reported restart requirement; do not reboot or treat a still-running installation as success.

Before exposing or starting `sshd`, inspect effective Windows Firewall policy. The firewall service must be running and all profiles enabled; if not, stop for review rather than silently changing global firewall settings. Resolve and verify the actual `sshd.exe` path from its service configuration. The approved policy must allow TCP 22 for that executable only from `100.64.0.0/10` and `fd7a:115c:a1e0::/48` and block other sources, even when broad application allow rules exist. Authenticated bypass/IPsec rules can override ordinary blocks: inspect them and stop if their impact is unclear. Preserve unrelated rules. Verify the active policy, program, service, protocol, ports, profiles, interfaces, and source ranges after approved changes; a single Tailscale allow rule does not prove isolation.

Back up the SSH configuration and approved firewall state before changing them. Review global directives and `Match` blocks in `C:\ProgramData\ssh\sshd_config`; do not broadly replace every matching line. Enable public-key authentication for the approved access model. Human password SSH is an explicit owner decision; preserve the existing setting unless a change is approved. Configure a PowerShell default SSH shell, automatic `sshd` startup, or restart only if approved. Validate configuration with the installed `sshd.exe -t` before restart.

## Install the public key

For an approved administrator login using the default Microsoft OpenSSH administrator match rule, add the validated runtime public key to `C:\ProgramData\ssh\administrators_authorized_keys` without removing unrelated entries. Review existing contents and back them up first. Restrict ownership/access to the local Administrators SID (`S-1-5-32-544`) and SYSTEM SID (`S-1-5-18`) as required by Microsoft OpenSSH, with inheritance disabled, only after explicit ACL approval. Re-read and verify effective ACLs; do not overwrite unrelated ACLs blindly. Nonadministrator logins use their configured authorized-keys path and need a separately reviewed plan.

## Verify and finish

After the approved configuration changes, collect and out-of-band verify the server host-key fingerprint before installing it in the support host's known-hosts file. Use [connect.md](connect.md) for a strict key-only session, confirm `whoami`, `hostname`, OS details, `sshd` status, and the expected target/network mapping. Verify effective source restrictions, including IPv6, with owner-approved tests. Log which stages actually completed, what was preserved, and any pending rename/reboot. Keep the owner's local recovery route available; do not claim onboarding is complete on an untested machine.
