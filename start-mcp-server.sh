#!/usr/bin/env bash

# This wrapper script loads environment variables from the current working directory's .env file
# before starting the Linear MCP server. This allows each project to have its own .env with
# different LINEAR_API_KEY and LINEAR_TEAM_ID values.

set -a  # Automatically export all variables

# Try to load .env from current working directory
if [ -f ".env" ]; then
  source .env
fi

# Try to load from parent directory (for worktree scenarios)
if [ -f "../.env" ]; then
  source ../.env
fi

set +a  # Stop auto-exporting

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Start the MCP server
npx tsx "$SCRIPT_DIR/mcp-server.ts"
