Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap("E:\sireyo-admin-dashboard\sireyoicon.png")
$iconHandle = $bmp.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($iconHandle)
$stream = New-Object System.IO.FileStream("E:\sireyo-admin-dashboard\sireyoicon.ico", [System.IO.FileMode]::Create)
$icon.Save($stream)
$stream.Close()
$icon.Dispose()
$bmp.Dispose()

$WshShell = New-Object -comObject WScript.Shell
$DesktopPath = [Environment]::GetFolderPath("Desktop")
$Shortcut = $WshShell.CreateShortcut("$DesktopPath\Sireyo Dashboard.lnk")
$Shortcut.TargetPath = "E:\sireyo-admin-dashboard\start-servers.bat"
$Shortcut.WorkingDirectory = "E:\sireyo-admin-dashboard"
$Shortcut.IconLocation = "E:\sireyo-admin-dashboard\sireyoicon.ico"
$Shortcut.Description = "Start Sireyo Admin Dashboard"
$Shortcut.Save()

Write-Host "Created Sireyo Dashboard shortcut on your Desktop!"
