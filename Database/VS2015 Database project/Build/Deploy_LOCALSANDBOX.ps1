cls

#Gather working directory (script path)
$script_path = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $script_path 

$output_dacpac = "$script_path\..\bin\Release\BUMDatabase.dacpac"

# 1. Build

& 'C:\Program Files (x86)\MSBuild\12.0\Bin\msbuild.exe' "$script_path\..\..\BUM.sln" /t:Build /p:Configuration=Release

if(-not $?){ 
    Write-Host "Press any key to continue ..."
    $x = $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 
}

# 2. Enable FileStream if not enabled
& $script_path\Enable-Filestream.cmd

# 3. Deploy to (local)\BUM

$sqlpackageArgs = @(`
	"/Action:Publish", `
	"/SourceFile:`"$output_dacpac`"", `
	"/TargetServerName:`"(local)\BUM`"", `
	"/TargetDatabaseName:`"BUMDatabase`"" `
)

& 'C:\Program Files (x86)\Microsoft Visual Studio 12.0\Common7\IDE\Extensions\Microsoft\SQLDB\DAC\120\SqlPackage.exe' $sqlpackageArgs

if(-not $?) {
    Write-Host "Press any key to continue ..."
    $x = $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}