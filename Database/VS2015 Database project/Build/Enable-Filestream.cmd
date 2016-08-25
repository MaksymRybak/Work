@ECHO OFF

SET scriptpath=%~dp0

SQLCMD -E -S(local)\SQLEXPRESS -Q "SET NOCOUNT ON; SELECT CAST(value_in_use AS char(1)) FROM sys.configurations WHERE name = 'filestream access level';" -h -1 -o .\output.txt
FOR /F %%A IN (.\output.txt) DO CALL :perform %%A

:perform


if exist .\output.txt DEL .\output.txt /Q
IF [%1] == [0] (
    GOTO changefs
) ELSE (
    EXIT /B 0
)

:changefs

powershell %scriptpath%enable-filestream.ps1
sqlcmd -E -S(local)\SQLEXPRESS -Q"EXEC sp_configure 'ADVANCED', 1; RECONFIGURE WITH OVERRIDE; EXEC sp_configure 'filestream access level', 1; RECONFIGURE WITH OVERRIDE;"

GOTO exitbatch

:exitbatch

EXIT /B 0