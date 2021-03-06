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

# 2. Deploy to TSTSQL09\SQL09

$sqlpackageArgs = @(`
	"/Action:Publish", `
	"/SourceFile:`"$output_dacpac`"", `
	"/TargetServerName:`"TSTSQL03\SQL03`"", `
	"/TargetDatabaseName:`"BUM`"" `
)

& 'C:\Program Files (x86)\Microsoft Visual Studio 12.0\Common7\IDE\Extensions\Microsoft\SQLDB\DAC\120\SqlPackage.exe' $sqlpackageArgs

if(-not $?) {
    Write-Host "Press any key to continue ..."
    $x = $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}