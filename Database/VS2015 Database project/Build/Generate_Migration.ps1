cls

#Gather working directory (script path)
$script_path = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $script_path 


$snapshot_ts = $(get-date -f yyyyMMdd_HH-mm-ss)
$migration_ts = $(get-date -f yyyyMMddHHmm)

$project_file = ($script_path + "\..\App.Database.sqlproj")

$output_migration = "E:\RepoTFS\SqlScripts\Migrations\TechCompetenceCenter\$($migration_ts)_ConfigurationDatabase_Releaser_.sql"
$output_dacpac = "$script_path\..\bin\Release\App.Database.dacpac"

# 1. Build

& 'C:\Program Files (x86)\MSBuild\14.0\Bin\msbuild.exe' "$script_path\..\..\App.sln" /t:Build /p:Configuration=Release

if(-not $?){ exit };

# 2. Generate diff script
$lastSnapshot = Get-ChildItem -Path ($script_path + "\..\Snapshots\") | Sort-Object Name -Descending | Select-Object -First 1

$sqlpackageArgs = @(`
	"/Action:Script", `
	"/SourceFile:`"$output_dacpac`"", `
	"/TargetFile:`"$($lastSnapshot.FullName)`"", `
	"/OutputPath:`"$output_migration`"", `
	"/TargetDatabaseName:`"App.Database`"" `
)

& 'C:\Program Files (x86)\Microsoft Visual Studio 14.0\Common7\IDE\Extensions\Microsoft\SQLDB\DAC\120\SqlPackage.exe' $sqlpackageArgs

if(-not $?){ 
	# Cleanup temp files
	del $output_migration
	exit 
}

# 3. Open script in SSMS

& $output_migration

# 4. Copy snapshot to project folder /snapshots

$target_dacpac = ($script_path + "\..\Snapshots\App.Database_" + $snapshot_ts + ".dacpac")
cp $output_dacpac $target_dacpac

# 5. Add snapshot file to project

$proj = [xml](gc $project_file)

$shouldSave = $false

$proj.Project.ChildNodes | % {
	$CurrentNode = $_
	if(($CurrentNode.Name -eq "ItemGroup") -and ($CurrentNode.Attributes.Count -gt 0) -and ($CurrentNode.Attributes.ItemOf("Label").Value -eq "Snapshots")){
		$newNode = $proj.CreateElement("None", $proj.DocumentElement.NamespaceURI) 
		$newNode.SetAttribute("Include",$target_dacpac)
		[Void]$CurrentNode.AppendChild($newNode)
		$shouldSave = $true
	}
}

if($shouldSave) {
	$proj.Save($project_file)
}