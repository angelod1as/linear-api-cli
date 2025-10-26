# Linear API - CLI Usage Guide

This is a simple, **non-interactive** CLI for Linear's API. All commands accept flags - no prompts, perfect for LLM usage.

## Setup

### 1. Get Your Linear Personal API Key

1. Go to Linear: https://linear.app/settings/api
2. Click **Create Personal API Key**
3. Copy the key (shown only once)

### 2. Configure Environment

```bash
# Copy the template
cp .env.example .env

# Edit .env and add your API key
LINEAR_API_KEY=lin_api_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. Get Your Team ID

```bash
pnpm linear:teams
```

Copy the team ID and add it to `.env`:
```
LINEAR_TEAM_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

## Commands

All commands are run with `pnpm` from the `linear-api` directory.

### Test Suite

Verify your setup is working correctly:

```bash
pnpm test
```

**What it does:**
- Checks API key and team ID are configured
- Tests creating issues
- Tests listing issues
- Tests getting issue details
- Tests filtering and options

**Note:** Creates actual test issues in Linear (marked with `[TEST]`). Delete them manually after testing.

---

### List Teams

Shows all teams you have access to. Use this to find your team ID.

```bash
pnpm linear:teams
```

**Output:**
```
Available teams:
================

Positiv Website (POS)
  ID: 20a312f9-eb0b-42c0-b61d-6212ca72d7ef
```

---

### Create Issue

Create a new Linear issue with optional metadata.

**Basic usage:**
```bash
pnpm linear:create --title "Issue title"
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

**Options:**
- `--title` (required): Issue title
- `--description`: Issue description in markdown
- `--priority`: One of: `urgent`, `high`, `medium`, `low`
- `--status`: Status/State name (e.g., `"Todo"`, `"In Progress"`, `"Done"`)
- `--project`: Project name or ID
- `--assignee`: Username, email, or display name
- `--tag`: Tag/Label name (can be used multiple times)

**Output:**
```
✓ Issue created successfully!

  ID: POS-123
  Title: Fix authentication bug
  URL: https://linear.app/positiv/issue/POS-123
  State: Todo
```

---

### List Issues

List issues from your configured team with optional filters.

**Basic usage:**
```bash
pnpm linear:list
```

**With filters:**
```bash
# Filter by status
pnpm linear:list --status "In Progress"

# Limit results
pnpm linear:list --limit 10

# Filter by assignee ID
pnpm linear:list --assignee "user-uuid-here"
```

**Options:**
- `--status`: Filter by status/state name
- `--limit`: Maximum number of issues to return (default: 50)
- `--assignee`: Filter by assignee ID

**Output:**
```
Found 3 issue(s):

[POS-123] Fix authentication bug
  State: In Progress
  Assignee: Angelo Dias
  URL: https://linear.app/positiv/issue/POS-123

[POS-124] Add dark mode
  State: Todo
  URL: https://linear.app/positiv/issue/POS-124
```

---

### Get Issue

Get detailed information about a specific issue.

```bash
pnpm linear:get POS-123
```

**Output:**
```
[POS-123] Fix authentication bug

Description: Users cannot login after password reset
State: In Progress
Priority: 2
Assignee: Angelo Dias (angelo@example.com)
URL: https://linear.app/positiv/issue/POS-123
```

---

### Delete Issue

Delete a Linear issue permanently.

```bash
pnpm linear:delete POS-123
```

**Output:**
```
✓ Issue POS-123 deleted successfully!
```

**Warning:** This action is permanent and cannot be undone.

---

## Complete Examples

### Example 1: Create a high-priority bug

```bash
pnpm linear:create \
  --title "Login page crashes on mobile" \
  --description "The login page throws an error on iOS Safari" \
  --priority urgent \
  --status "Todo" \
  --tag Bug \
  --assignee "oiangelodias"
```

### Example 2: Create a feature request with project

```bash
pnpm linear:create \
  --title "Add newsletter subscription form" \
  --description "Integrate Listmonk newsletter signup" \
  --priority medium \
  --status "Backlog" \
  --project "listmonk-newsletter-integration-76f8a7b887c7" \
  --tag Feature \
  --tag Frontend
```

### Example 3: List all "In Progress" issues

```bash
pnpm linear:list --status "In Progress"
```

### Example 4: Get details of a specific issue

```bash
pnpm linear:get POS-123
```

---

## Priority Values

When creating issues, use these values for `--priority`:
- `urgent` - Highest priority
- `high` - High priority
- `medium` - Medium priority (default)
- `low` - Low priority

When viewing issues, priority is shown as a number:
- `1` = Urgent
- `2` = High
- `3` = Medium
- `4` = Low

---

## Finding Status Names

Status names are team-specific. Common statuses include:
- `Backlog`
- `Todo`
- `In Progress`
- `Done`
- `Canceled`

Use `pnpm linear:list` to see what statuses exist in your team.

---

## Finding Project Names

Projects can be specified by name or ID. If using a project ID (like from a URL), you can paste it directly:

```bash
--project "listmonk-newsletter-integration-76f8a7b887c7"
```

Or use part of the project name:

```bash
--project "newsletter"
```

---

## Error Handling

If a command fails, you'll see an error message:

```bash
Error: LINEAR_API_KEY is not set in .env file
```

Common errors:
- **Missing API key**: Add `LINEAR_API_KEY` to `.env`
- **Missing team ID**: Add `LINEAR_TEAM_ID` to `.env` (run `pnpm linear:teams` to find it)
- **Issue not found**: Check the issue identifier
- **Invalid priority**: Use `urgent`, `high`, `medium`, or `low`

---

## Notes for LLMs

- **All commands are non-interactive** - no prompts, just flags
- **All parameters are optional except `--title`** for create command
- **Multiple tags** can be added by repeating `--tag` flag
- **Status and project names** are fuzzy-matched (case-insensitive)
- **Assignee lookup** works with username, email, or display name
- **All commands exit with code 1 on error** for easy error detection

---

## Quick Reference

```bash
# Setup
cp .env.example .env
# Add LINEAR_API_KEY to .env
pnpm linear:teams
# Add LINEAR_TEAM_ID to .env

# Verify setup
pnpm test

# Create issue
pnpm linear:create --title "Title" [options]

# List issues
pnpm linear:list [--status "Status"] [--limit N]

# Get issue
pnpm linear:get POS-123

# Delete issue
pnpm linear:delete POS-123

# List teams
pnpm linear:teams
```
