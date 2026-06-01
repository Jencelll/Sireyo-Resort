$WshShell = New-Object -comObject WScript.Shell
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$DesktopPath = [Environment]::GetFolderPath("Desktop")
$Shortcut = $WshShell.CreateShortcut((Join-Path $DesktopPath "Sireyo Dashboard.lnk"))
$Shortcut.TargetPath = Join-Path $ScriptDir "start-servers.bat"
$Shortcut.WorkingDirectory = $ScriptDir
$IconPath = Join-Path $ScriptDir "sireyoicon-real.ico"
if (-not (Test-Path $IconPath)) {
	$IconPath = Join-Path $ScriptDir "sireyoicon.ico"
}
if (Test-Path $IconPath) {
	$Shortcut.IconLocation = $IconPath
}
$Shortcut.Description = "Start Sireyo Admin Dashboard"
$Shortcut.Save()

Write-Host "Created Sireyo Dashboard shortcut on your Desktop!"
