// Fast clipboard reader for the fast-paste Claude Code plugin.
//   clip.exe               image -> saved as PNG under %TEMP%\claude-fast-paste, prints "IMG:<path>"
//                          text  -> prints "TXT:<text>"
//                          exit code 2 when the clipboard holds neither
//   clip.exe --prune <N>   deletes saved clips older than N days
// Built by the plugin with the .NET Framework csc.exe, which only accepts C# 5.
using System;
using System.Drawing.Imaging;
using System.IO;
using System.Text;
using System.Windows.Forms;

static class Clip
{
    static readonly string ClipDir = Path.Combine(Path.GetTempPath(), "claude-fast-paste");

    [STAThread]
    static int Main(string[] args)
    {
        if (args.Length == 2 && args[0] == "--prune") return Prune(int.Parse(args[1]));

        Console.OutputEncoding = new UTF8Encoding(false);

        if (Clipboard.ContainsImage())
        {
            Directory.CreateDirectory(ClipDir);
            var path = Path.Combine(ClipDir, "clip-" + DateTime.Now.ToString("yyyyMMdd-HHmmss-fff") + ".png");
            using (var img = Clipboard.GetImage())
            {
                img.Save(path, ImageFormat.Png);
            }
            Console.Write("IMG:" + path);
            return 0;
        }

        if (Clipboard.ContainsText())
        {
            Console.Write("TXT:" + Clipboard.GetText());
            return 0;
        }

        return 2;
    }

    static int Prune(int keepDays)
    {
        if (!Directory.Exists(ClipDir)) return 0;

        var cutoff = DateTime.Now.AddDays(-keepDays);
        foreach (var file in Directory.GetFiles(ClipDir, "clip-*.png"))
        {
            if (File.GetLastWriteTime(file) >= cutoff) continue;
            try { File.Delete(file); }
            catch (IOException) { }
            catch (UnauthorizedAccessException) { }
        }
        return 0;
    }
}
