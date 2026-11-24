# fast-paste

Claude Code plugin for Windows that pastes clipboard images fast.

The built-in image paste (Alt+V) launches `powershell.exe` twice per paste, which takes about 1.2 s. This plugin uses a small compiled helper instead and pastes in about 70 ms:

- **Image on the clipboard:** saved as a PNG under `%TEMP%\claude-fast-paste` and inserted as an `@<path>` mention, which Claude Code attaches as an image when the prompt is sent.
- **Text on the clipboard:** inserted as text.

Saved clips older than 2 days are deleted in the background after each image paste.

## Requirements

- Windows with the .NET Framework 4 compiler (`C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe`, present on Windows 10/11). The plugin compiles `helper/clip.cs` on first use.
- Windows Terminal, with Alt+Shift+V bound to send the marker character `⧉` (U+29C9). Add to Windows Terminal's `settings.json`:

```jsonc
"actions": [
  { "command": { "action": "sendInput", "input": "\u29c9" }, "id": "User.sendInput.ClaudeFastPaste" }
],
"keybindings": [
  { "id": "User.sendInput.ClaudeFastPaste", "keys": "alt+shift+v" }
]
```

Alt+Shift+V then types `⧉` in other programs running in Windows Terminal.

## Install

```
claude plugin install fast-paste --marketplace brunolm/ai
```
