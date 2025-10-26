# Linear API CLI

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Issues](https://img.shields.io/github/issues/angelodias/linear-api-cli.svg)](https://github.com/angelodias/linear-api-cli/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/angelodias/linear-api-cli/blob/main/CONTRIBUTING.md)

A simple, **non-interactive** Linear CLI designed to be easily consumable by LLMs (Language Model Agents). All commands use flags - no prompts, perfect for programmatic task creation and management.

## Why This Project?

Most Linear integrations and CLIs are designed for human interaction with prompts and interactive flows. This becomes problematic when you want LLM agents (like Claude, GPT, etc.) to manage Linear issues programmatically.

Additionally, the Linear MCP (Model Context Protocol) can be flaky and doesn't always work reliably, making it frustrating for automated workflows.

**This CLI solves that by:**
- Accepting all parameters via command-line flags (zero prompts)
- Providing predictable, parseable output
- Supporting fuzzy matching for statuses, projects, and assignees
- Being completely standalone and portable
- Working reliably every time

Perfect for AI agents, automation scripts, CI/CD pipelines, and webhook integrations.

## Features

- ✅ **100% non-interactive** - all parameters via command-line flags
- ✅ Create issues with full metadata (status, priority, project, assignee, tags)
- ✅ List and filter issues
- ✅ Get issue details
- ✅ List available teams
- ✅ LLM-friendly - clear documentation, predictable output
- ✅ Portable - works standalone, can be copied to any project

## Prerequisites

- Node.js 18 or higher
- pnpm (recommended) or npm
- A Linear account with API access

## Installation

```bash
# Clone the repository
git clone https://github.com/angelodias/linear-api-cli.git
cd linear-api-cli

# Install dependencies
pnpm install
```

## Quick Start

### 1. Setup Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your credentials
```

### 2. Get Your Linear API Key

1. Go to [Linear Settings → API](https://linear.app/settings/api)
2. Create a Personal API Key
3. Add it to `.env`:
   ```
   LINEAR_API_KEY=lin_api_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

### 3. Get Your Team ID

```bash
pnpm linear:teams
```

Copy your team ID and add it to `.env`:
```
LINEAR_TEAM_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### 4. Verify Setup (Optional)

Run the test suite to ensure everything is configured correctly:

```bash
pnpm test
```

This will:
- Verify your API key and team ID are set
- Test creating issues
- Test listing issues
- Test getting issue details
- Report any configuration problems

**Note:** The test creates actual issues in Linear (marked with `[TEST]`). Delete them manually after testing.

## Usage

### Create an Issue

**Simple:**
```bash
pnpm linear:create --title "Fix login bug"
```

**With all options:**
```bash
pnpm linear:create \
  --title "Fix authentication bug" \
  --description "Users cannot login after password reset" \
  --priority high \
  --status "Todo" \
  --project "listmonk-newsletter-integration-76f8a7b887c7" \
  --assignee "oiangelodias" \
  --tag Admin \
  --tag Feature
```

### List Issues

```bash
# List all issues
pnpm linear:list

# Filter by status
pnpm linear:list --status "In Progress"

# Limit results
pnpm linear:list --limit 10
```

### Get Issue Details

```bash
pnpm linear:get POS-123
```

### Delete Issue

```bash
pnpm linear:delete POS-123
```

### List Teams

```bash
pnpm linear:teams
```

## Available Commands

| Command | Description |
|---------|-------------|
| `pnpm test` | Run test suite to verify setup |
| `pnpm linear:teams` | List all available teams |
| `pnpm linear:create` | Create a new issue |
| `pnpm linear:list` | List issues with optional filters |
| `pnpm linear:get <id>` | Get specific issue details |
| `pnpm linear:delete <id>` | Delete an issue |

## Create Issue Options

- `--title` (required) - Issue title
- `--description` - Issue description (markdown)
- `--priority` - Priority: `urgent`, `high`, `medium`, `low`
- `--status` - Status/State (e.g., "Todo", "In Progress")
- `--project` - Project name or ID
- `--assignee` - Username, email, or display name
- `--tag` - Tag/Label name (can be used multiple times)

## Complete Documentation

See [USAGE.md](./USAGE.md) for:
- Detailed setup instructions
- Complete examples for all commands
- Troubleshooting guide
- LLM usage notes

## For LLMs

This CLI is designed specifically for LLM consumption:

1. **No interactivity** - All parameters passed via flags
2. **Predictable output** - Consistent format for parsing
3. **Clear errors** - Helpful error messages with exit codes
4. **Fuzzy matching** - Status, project, and assignee names are matched flexibly
5. **Complete docs** - USAGE.md contains all necessary information

Read [USAGE.md](./USAGE.md) and you'll be able to create and manage Linear issues immediately.

## Portability

This integration is completely standalone:
- Copy the `linear-api` folder to any project
- Install dependencies: `pnpm install`
- Configure `.env` with your credentials
- Start using the CLI

No integration with existing codebases required.

## Technical Stack

- **Linear SDK**: `@linear/sdk` for API interaction
- **CLI Parser**: `commander` for flag parsing
- **Runtime**: Node.js with TypeScript via `tsx`
- **Config**: Environment variables via `dotenv`

## Example: Real-World Usage

```bash
# Create a high-priority bug assigned to you
pnpm linear:create \
  --title "Login page crashes on mobile" \
  --description "The login page throws an error on iOS Safari" \
  --priority urgent \
  --status "Todo" \
  --tag Bug \
  --assignee "oiangelodias"

# Output:
# ✓ Issue created successfully!
#   ID: POS-456
#   Title: Login page crashes on mobile
#   URL: https://linear.app/positiv/issue/POS-456
#   State: Todo
```

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on:

- Reporting bugs
- Suggesting features
- Development setup
- Pull request process

## Support

- **Issues**: Report bugs or request features via [GitHub Issues](https://github.com/angelodias/linear-api-cli/issues)
- **Discussions**: Ask questions or share ideas in [GitHub Discussions](https://github.com/angelodias/linear-api-cli/discussions)

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

Vibe-coded by [Angelo Dias](https://www.angelodias.com.br) with help from Claude Code.

**Note**: This project is not affiliated with or endorsed by Linear. It's an independent tool using Linear's public API.
