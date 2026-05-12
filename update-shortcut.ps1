$WshShell = New-Object -comObject WScript.Shell
$DesktopPath = [Environment]::GetFolderPath("Desktop")
$Shortcut = $WshShell.CreateShortcut("$DesktopPath\Sireyo Dashboard.lnk")
$Shortcut.TargetPath = "E:\sireyo-admin-dashboard\start-servers.bat"
$Shortcut.WorkingDirectory = "E:\sireyo-admin-dashboard"
$Shortcut.IconLocation = "E:\sireyo-admin-dashboard\sireyoicon-real.ico"
$Shortcut.Description = "Start Sireyo Admin Dashboard"
$Shortcut.Save()

Write-Host "Updated Sireyo Dashboard shortcut with new real icon!"