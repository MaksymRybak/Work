# Enable FILESTREAM
$instance = "SQLEXPRESS"
$wmi = Get-WmiObject -Namespace "ROOT\Microsoft\SqlServer\ComputerManagement11" -Class FilestreamSettings | where {$_.InstanceName -eq $instance}
[Void]$wmi.EnableFilestream(1, $instance)
Get-Service -Name ("MSSQL$" + $instance) | Restart-Service -Force
