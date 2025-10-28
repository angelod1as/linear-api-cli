# Linear API - Usage Guide

This guide covers both **CLI** and **MCP** usage for managing Linear issues programmatically.

## Setup

### 1. Get Your Linear API Key

1. Go to [Linear Settings → API](https://linear.app/settings/api)
2. Click **Create Personal API Key**
3. Copy the key (shown only once)

### 2. Get Your Team ID

```bash
pnpm linear:teams
```

### 3. Configure Environment

In each project that needs Linear access, create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:
```
LINEAR_API_KEY=lin_api_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
LINEAR_TEAM_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

---

## MCP Usage (Claude Code)

### Setup (One Time Only)

```bash
claude mcp add --scope user --transport stdio linear -- /absolute/path/to/linear-api/start-mcp-server.sh
```

Replace `/absolute/path/to/linear-api/` with the actual path to this directory.

### How It Works

The MCP server automatically loads credentials from your project's `.env` file. Different projects can have different Linear teams.

### Available MCP Tools

| Tool | Purpose | Required | Optional |
|------|---------|----------|----------|
| `linear_list_teams` | List teams | - | - |
| `linear_create_issue` | Create issue | `title` | `description`, `priority`, `status`, `project`, `assignee`, `labels` |
| `linear_update_issue` | Update issue | `issueId` | `title`, `description`, `priority`, `status`, `project`, `assignee`, `labels` |
| `linear_list_issues` | List issues | - | `status`, `limit`, `assigneeId` |
| `linear_get_issue` | Get issue details | `issueId` | - |
| `linear_delete_issue` | Delete issue | `issueId` | - |

### Example MCP Usage

```
You: "Create a Linear issue titled 'Add dark mode' with high priority"
Claude: [Uses linear_create_issue tool automatically]

You: "List all issues in Todo status"
Claude: [Uses linear_list_issues with status="Todo"]

You: "Update POS-123 to In Progress"
Claude: [Uses linear_update_issue]
```

### Managing MCP

```bash
# List configured servers
claude mcp list

# Check Linear server status
claude mcp get linear

# Remove Linear server
claude mcp remove linear -s user
```

---

## CLI Usage

All commands run from the `linear-api` directory.

### Create Issue

```bash
# Basic
pnpm linear:create --title "Fix login bug"

# With options
pnpm linear:create \
  --title "Fix authentication bug" \
  --description "Users cannot login after password reset" \
  --priority high \
  --status "Todo" \
  --assignee "username" \
  --tag Bug
```

**Options:**
- `--title` (required) - Issue title
- `--description` - Markdown description
- `--priority` - `urgent`, `high`, `medium`, `low`
- `--status` - State name (e.g., "Todo", "In Progress")
- `--project` - Project name or ID
- `--assignee` - Username, email, or display name
- `--tag` - Label (can use multiple times)

### Update Issue

```bash
pnpm linear:update POS-123 --status "Done" --assignee "username"
```

Uses same options as create (all optional except issue ID).

### List Issues

```bash
# All issues
pnpm linear:list

# Filter by status
pnpm linear:list --status "In Progress"

# Limit results
pnpm linear:list --limit 10
```

### Get Issue

```bash
pnpm linear:get POS-123
```

### Delete Issue

```bash
pnpm linear:delete POS-123
```

**Warning:** Permanent deletion, cannot be undone.

### List Teams

```bash
pnpm linear:teams
```

---

## Examples

### Create High-Priority Bug

```bash
pnpm linear:create \
  --title "Login crashes on mobile" \
  --description "Error on iOS Safari" \
  --priority urgent \
  --status "Todo" \
  --tag Bug \
  --assignee "dev@example.com"
```

### Create Feature Request

```bash
pnpm linear:create \
  --title "Add newsletter signup" \
  --priority medium \
  --project "newsletter-integration" \
  --tag Feature
```

### List In-Progress Issues

```bash
pnpm linear:list --status "In Progress"
```

---

## Priority Values

**When creating:**
- `urgent` - Highest
- `high` - High
- `medium` - Medium (default)
- `low` - Low

**When viewing:**
- `1` = Urgent
- `2` = High
- `3` = Medium
- `4` = Low

---

## Finding Values

**Status Names:** Team-specific. Common values: `Backlog`, `Todo`, `In Progress`, `Done`, `Canceled`

**Projects:** Use project ID from URL or partial name match (case-insensitive)

**Assignees:** Can use username, email, or display name (fuzzy matched)

---

## Troubleshooting

**Missing API key:**
```
Error: LINEAR_API_KEY is not set in .env file
```
→ Add `LINEAR_API_KEY` to `.env`

**Missing team ID:**
```
Error: LINEAR_TEAM_ID is not set in .env file
```
→ Run `pnpm linear:teams` and add `LINEAR_TEAM_ID` to `.env`

**MCP not connecting:**
```bash
claude mcp list
# Shows: linear: ... - ✗ Failed to connect
```
→ Check the path in your MCP configuration is correct
→ Ensure `.env` exists in your project directory
→ Try `pnpm linear:teams` to verify credentials work

**Issue not found:**
→ Verify the issue ID is correct (e.g., `POS-123`)

---

## Notes for LLMs

- All commands are **100% non-interactive** (no prompts)
- Only `--title` is required for `create`
- Status, project, and assignee names are **fuzzy-matched**
- Multiple `--tag` flags can be used
- Exit code 1 on errors
- MCP tools mirror CLI functionality exactly

---

## Quick Reference

```bash
# Setup
cp .env.example .env
pnpm linear:teams  # Get team ID
# Edit .env with LINEAR_API_KEY and LINEAR_TEAM_ID

# MCP Setup (once)
claude mcp add --scope user --transport stdio linear -- /path/to/linear-api/start-mcp-server.sh

# CLI Commands
pnpm linear:create --title "Title" [options]
pnpm linear:update <id> [options]
pnpm linear:list [--status "Status"] [--limit N]
pnpm linear:get <id>
pnpm linear:delete <id>
pnpm linear:teams
pnpm test  # Verify setup
```
