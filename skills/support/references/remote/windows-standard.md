# Windows access standard

The intended path is `approved host → customer's Tailscale network → standard SSH → agreed Windows PC`. No public ports, router changes, RDP, LAN SSH, or additional inbound services.

Before onboarding, read [onboard-windows.md](onboard-windows.md), inspect the existing state, and obtain explicit owner approval for the actual plan. The source material's blanket paste-and-run bootstrap is not authority to change security settings.

For an approved support account:

- A local account, commonly `admin`, may be created with an owner-approved strong password and local Administrators membership. Hiding, enabling, and password-expiry policy require approval. Never reset or repurpose an unrelated existing account.
- Leave staff accounts, profiles, files, and unrelated configuration alone.
- Install Microsoft OpenSSH Server only if approved; manage `sshd` startup and restart within the agreed outage window.
- Allow SSH TCP 22 only from Tailscale addresses (`100.64.0.0/10`, `fd7a:115c:a1e0::/48`). Inspect broad allow and authenticated bypass rules and effective policy; do not claim isolation from a single allow rule.
- Install a runtime-supplied, validated owner-approved Ed25519 public key in `administrators_authorized_keys` when the approved login is an administrator. Preserve unrelated keys and review ACL changes; Microsoft OpenSSH requires appropriately restricted access for that file.
- Agents use key authentication only. Human password SSH and password-expiry policy are separate owner decisions, not enabled or changed implicitly.

Record the verified OS-name/overlay-name mapping and support username in external inventory. Renaming is optional and separately approved; do not force names to match without considering domain membership and service dependencies.

Verify from the approved host using [connect.md](connect.md), then inspect:

```powershell
whoami
hostname
Get-ComputerInfo | Select-Object CsName, WindowsProductName, WindowsVersion
Get-Service sshd
Get-Printer
Get-PrinterPort
```

Verify effective firewall restrictions and key authentication separately. Any test from an unapproved network or changes to ACLs for testing need approval. Do not claim onboarding is complete until the approved changes and access restrictions have been tested on the actual machine.
