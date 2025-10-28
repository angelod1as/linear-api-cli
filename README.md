# Linear API CLI & MCP Server

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Issues](https://img.shields.io/github/issues/angelod1as/linear-api-cli.svg)](https://github.com/angelod1as/linear-api-cli/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/angelod1as/linear-api-cli/blob/main/CONTRIBUTING.md)
[![Model Context Protocol](https://img.shields.io/badge/MCP-Server-blue.svg)](https://modelcontextprotocol.io)

Non-interactive Linear CLI and MCP server for LLM agents. Zero prompts, all flags. Works with Claude Code, automation scripts, and CI/CD pipelines.

## Quick Install

```bash
git clone https://github.com/angelod1as/linear-api-cli.git
cd linear-api-cli
pnpm install

# Setup credentials
cp .env.example .env
# Edit .env with your LINEAR_API_KEY and LINEAR_TEAM_ID
```

**Get credentials:**
1. API Key: [Linear Settings → API](https://linear.app/settings/api)
2. Team ID: Run `pnpm linear:teams`

## Usage

### As CLI

```bash
# Create issue
pnpm linear:create --title "Fix login bug" --priority high

# List issues
pnpm linear:list --status "In Progress"

# Get issue
pnpm linear:get POS-123

# Update issue
pnpm linear:update POS-123 --status "Done"
```

### As MCP Server (Claude Code)

**One-time setup:**
```bash
claude mcp add --scope user --transport stdio linear -- /absolute/path/to/linear-api/start-mcp-server.sh
```

**That's it!** Now Claude Code can create/list/update Linear issues automatically. The MCP server reads credentials from each project's `.env` file.

**Example:**
```
You: "Create a Linear issue for fixing the auth bug"
Claude: [Uses linear_create_issue tool]
```

## Available Commands

| CLI Command | Description |
|-------------|-------------|
| `pnpm linear:teams` | List all available teams |
| `pnpm linear:create` | Create issue with --title, --description, --priority, --status, --assignee, --tag |
| `pnpm linear:update <id>` | Update issue (same flags as create) |
| `pnpm linear:list` | List issues with --status, --limit, --assignee filters |
| `pnpm linear:get <id>` | Get issue details |
| `pnpm linear:delete <id>` | Delete issue |
| `pnpm test` | Verify setup |

## MCP Tools

The MCP server exposes 6 tools:
- `linear_list_teams` - List teams
- `linear_create_issue` - Create issue
- `linear_update_issue` - Update issue
- `linear_list_issues` - List/filter issues
- `linear_get_issue` - Get issue details
- `linear_delete_issue` - Delete issue

## Documentation

See [USAGE.md](./USAGE.md) for detailed examples, troubleshooting, and advanced usage.

## Why This Exists

- Official Linear MCP is unreliable
- Most Linear tools expect human interaction (prompts)
- LLMs need non-interactive, flag-based interfaces
- Projects need different Linear teams without complex config

## License

MIT - See [LICENSE](./LICENSE)

---

Vibe-coded by [Angelo Dias](https://www.angelodias.com.br) with Claude Code.
