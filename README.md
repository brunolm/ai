# ai

Index of AI-related projects: MCP servers tracked as git submodules, and Claude Code plugins.

## MCP servers

| MCP | Path | Repo |
|---|---|---|
| input | `mcp/input-mcp` | [brunolm/input-mcp](https://github.com/brunolm/input-mcp) |
| mal-mcp | `mcp/mal-mcp` | [brunolm/mal-mcp](https://github.com/brunolm/mal-mcp) |
| patchright | `mcp/patchright-mcp` | [brunolm/patchright-mcp](https://github.com/brunolm/patchright-mcp) |
| screenshot | `mcp/screenshot-mcp` | [brunolm/screenshot-mcp](https://github.com/brunolm/screenshot-mcp) |
| stealth-fetch | `mcp/stealth-fetch-mcp` | [brunolm/stealth-fetch-mcp](https://github.com/brunolm/stealth-fetch-mcp) |
| steam | `mcp/steam-mcp` | [brunolm/steam-mcp](https://github.com/brunolm/steam-mcp) |
| toggl | `mcp/toggl-mcp` | [brunolm/toggl-mcp](https://github.com/brunolm/toggl-mcp) |

## Claude Code plugins

This repo is a Claude Code plugin marketplace (`.claude-plugin/marketplace.json`).

| Plugin | Path | What it does |
|---|---|---|
| fast-paste | `plugins/fast-paste` | Windows: Alt+Shift+V pastes clipboard images (or text) in ~70 ms |

```powershell
claude plugin install <plugin> --marketplace brunolm/ai
```

## Cloning

```powershell
git clone --recurse-submodules <this-repo-url>
```

To pull submodule updates later: `git submodule update --remote`.
