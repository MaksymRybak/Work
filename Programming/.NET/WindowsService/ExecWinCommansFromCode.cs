public static ILog Log = LogManager.GetLogger(typeof(GitClient))

public readonly ProcessStartInfo StartInfo = new ProcessStartInfo
{
    UseShellExecute = false,
    CreateNoWindow = true,
    RedirectStandardOutput = true,
    RedirectStandardError = true,
    WindowStyle = ProcessWindowStyle.Hidden,
};

StartInfo.FileName = "git.exe";
StartInfo.WorkingDirectory = "FolderName";
StartInfo.Arguments = "windows commands, e.g: -c core.autocrlf=false pull origin";

var process = new Process { StartInfo = StartInfo };
//process.OutputDataReceived += LogOutput;
process.ErrorDataReceived += LogOutput;
process.Start();
process.BeginOutputReadLine();
process.BeginErrorReadLine();
process.WaitForExit();
if (process.ExitCode != 0)
    throw new Exception($"{command} execution failed with exit code {process.ExitCode}");

protected virtual void LogOutput(object sender, DataReceivedEventArgs e)
{
    if (e.Data == null || e.Data.Equals("") || e.Data.Contains("@")) return;
    if (e.Data.Contains("error") || e.Data.Contains("fatal"))
    {
        Log.Error(e.Data);
    }
    else
    {
        Log.Info(e.Data);
    }
}
