# Support work on the PC

Do this over the SSH session after [connect.md](connect.md). Confirm customer consent and stay on the agreed hostname. Prefer inspect, then the smallest approved fix. Inspection permission is not permission to cancel jobs, delete files, restart services, or change drivers.

## Identity

```powershell
whoami
hostname
Get-ComputerInfo | Select-Object CsName, WindowsProductName, WindowsVersion, OsHardwareAbstractionLayer
Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -like '*Tailscale*' -or $_.IPAddress -like '100.*' }
```

## Printers

```powershell
Get-Printer | Format-List Name, DriverName, PortName, PrinterStatus, JobCount
Get-PrinterPort | Format-List Name, PrinterHostAddress, PortNumber
Get-Printer | ForEach-Object { Get-PrintJob -PrinterName $_.Name -ErrorAction SilentlyContinue }
Get-Service spooler
```

After owner approval to cancel the named job and interrupt printing, use `Remove-PrintJob` for that specific stuck job and restart the spooler only if needed. Test the approved printer's port if it is TCP/IP; that printer check does not authorize connecting to other machines:

```powershell
Test-NetConnection -ComputerName <printer-ip> -Port 9100
```

Do not remove a printer or driver unless the user asked. Driver swaps and vendor-tool installs are explicit asks. Note the printer name, port, and status in the reply.

## Cleanup

Check free space first:

```powershell
Get-PSDrive -PSProvider FileSystem
```

Potential cleanup targets are the recycle bin, Windows temp, the current session user's temp, and Delivery Optimization cache. None is an automatic deletion default: the recycle bin can contain recoverable customer data, and temp files may be in use. Explain the proposed targets and obtain consent first. Skip Documents, Desktop, Downloads, other users' temp directories, and anything the user did not approve. Over SSH, `$env:TEMP` belongs to the support account, not necessarily the staff user with the issue.

Only after explicit approval for these exact targets, with applications checked for active use:

```powershell
Clear-RecycleBin -Force -ErrorAction SilentlyContinue
Remove-Item -Force -Recurse -ErrorAction SilentlyContinue $env:TEMP\*
Remove-Item -Force -Recurse -ErrorAction SilentlyContinue C:\Windows\Temp\*
```

Disk Cleanup / `cleanmgr` or supported Delivery Optimization cleanup can be used for the approved targets. Do not run `Remove-Item` against a user profile. `SilentlyContinue` can hide failures; inspect the outcome and measure free space again rather than treating the command as proof of success.

## Other Windows issues

Services, Event Viewer, and vendor logs beat guessing. `Get-WinEvent -LogName System -MaxEvents 50` inspects recent errors; summarize relevant findings without copying sensitive log contents into chat. Propose restarting the smallest affected service before considering a reboot, and obtain approval for the interruption. If a reboot is required, explain why and wait for explicit consent and a suitable time.

## Finish

Say the hostname, what you saw, the exact approved changes, verification results, and whether a reboot is still needed. The wrapper leaves the supplied key intact; its credential owner must complete secure temporary-file cleanup through the host-managed lifecycle.
