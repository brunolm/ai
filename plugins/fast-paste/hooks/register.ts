import type { EngineInterface, Register } from 'claude-code'

// Windows Terminal's Alt+Shift+V binding sends this character as typed input.
const MARKER = '⧉'
const IMAGE_PREFIX = 'IMG:'
const TEXT_PREFIX = 'TXT:'
const KEEP_DAYS = '2'
const CSC = 'C:/Windows/Microsoft.NET/Framework64/v4.0.30319/csc.exe'

export const register: Register = on => {
  let helper: Promise<string | undefined> | undefined

  on('session.start', ($, e, next) => {
    helper ??= ensureHelper($)
    return next(e)
  })

  on('prompt.edit', async ($, e, next) => {
    if (!e.inputText.includes(MARKER)) return next(e)

    helper ??= ensureHelper($)
    const exe = await helper
    if (!exe) {
      $.ui.toast('fast-paste: could not build the clipboard helper')
      return next({ ...e, inputText: e.inputText.replaceAll(MARKER, '') })
    }

    const { exitCode, stdout } = await $.process.run([exe], { timeoutMs: 5000 })
    const pasted = exitCode === 0 ? toPromptText(stdout) : ''
    if (!pasted) $.ui.toast('fast-paste: clipboard has no image or text')

    // Not awaited: pruning old clips must not delay the paste.
    if (stdout.startsWith(IMAGE_PREFIX)) void $.process.run([exe, '--prune', KEEP_DAYS]).catch(() => undefined)

    return next({ ...e, inputText: e.inputText.split(MARKER).join(pasted) })
  })
}

async function ensureHelper($: EngineInterface): Promise<string | undefined> {
  // csc.exe misresolves paths that mix '/' and '\', so every path it sees uses '\'.
  const dir = `${$.plugin.root}\\helper`.replaceAll('/', '\\')
  const exe = `${dir}\\clip.exe`
  if (await $.fs.exists(exe)) return exe

  const argv = [CSC, '/nologo', '/optimize', '/target:exe', `/out:${exe}`, '/r:System.Windows.Forms.dll', '/r:System.Drawing.dll', `${dir}\\clip.cs`]
  const { exitCode } = await $.process.run(argv, { timeoutMs: 60000 }).catch(() => ({ exitCode: 1 }))
  return exitCode === 0 ? exe : undefined
}

function toPromptText(stdout: string): string {
  if (stdout.startsWith(IMAGE_PREFIX)) return `@${stdout.slice(IMAGE_PREFIX.length).replaceAll('\\', '/')} `
  if (stdout.startsWith(TEXT_PREFIX)) return stdout.slice(TEXT_PREFIX.length).replaceAll('\r\n', '\n')
  return ''
}
