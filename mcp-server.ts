#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import {
  listTeams,
  createIssue,
  updateIssue,
  listIssues,
  getIssue,
  deleteIssue,
  CreateIssueParams,
  UpdateIssueParams,
  ListIssuesParams,
} from './linear.js';

const ListTeamsArgsSchema = z.object({});

const CreateIssueArgsSchema = z.object({
  title: z.string().describe('Issue title (required)'),
  description: z.string().optional().describe('Issue description in markdown'),
  priority: z.enum(['urgent', 'high', 'medium', 'low']).optional().describe('Issue priority'),
  status: z.string().optional().describe('Status/state name (e.g., "Todo", "In Progress")'),
  project: z.string().optional().describe('Project name or ID'),
  assignee: z.string().optional().describe('Assignee username, email, or display name'),
  labels: z.array(z.string()).optional().describe('Array of label/tag names'),
});

const UpdateIssueArgsSchema = z.object({
  issueId: z.string().describe('Issue ID or identifier (e.g., "POS-123")'),
  title: z.string().optional().describe('New issue title'),
  description: z.string().optional().describe('New issue description in markdown'),
  priority: z.enum(['urgent', 'high', 'medium', 'low']).optional().describe('New priority'),
  status: z.string().optional().describe('New status/state name'),
  project: z.string().optional().describe('New project name or ID'),
  assignee: z.string().optional().describe('New assignee username, email, or display name'),
  labels: z.array(z.string()).optional().describe('New array of label/tag names'),
});

const ListIssuesArgsSchema = z.object({
  status: z.string().optional().describe('Filter by status/state name'),
  limit: z.number().optional().describe('Maximum number of issues to return (default: 50)'),
  assigneeId: z.string().optional().describe('Filter by assignee ID'),
});

const GetIssueArgsSchema = z.object({
  issueId: z.string().describe('Issue ID or identifier (e.g., "POS-123")'),
});

const DeleteIssueArgsSchema = z.object({
  issueId: z.string().describe('Issue ID or identifier to delete'),
});

const server = new Server(
  {
    name: 'linear-api',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const tools: Tool[] = [
  {
    name: 'linear_list_teams',
    description: 'List all Linear teams you have access to. Use this to find team IDs and keys. No parameters required.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'linear_create_issue',
    description: 'Create a new Linear issue. Title is required, all other fields are optional. Supports priorities (urgent/high/medium/low), status, project assignment, assignee, and labels.',
    inputSchema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Issue title (required)',
        },
        description: {
          type: 'string',
          description: 'Issue description in markdown',
        },
        priority: {
          type: 'string',
          enum: ['urgent', 'high', 'medium', 'low'],
          description: 'Issue priority',
        },
        status: {
          type: 'string',
          description: 'Status/state name (e.g., "Todo", "In Progress")',
        },
        project: {
          type: 'string',
          description: 'Project name or ID',
        },
        assignee: {
          type: 'string',
          description: 'Assignee username, email, or display name',
        },
        labels: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'Array of label/tag names',
        },
      },
      required: ['title'],
    },
  },
  {
    name: 'linear_update_issue',
    description: 'Update an existing Linear issue. Requires issue ID or identifier (e.g., "POS-123"). All other fields are optional and will only update if provided.',
    inputSchema: {
      type: 'object',
      properties: {
        issueId: {
          type: 'string',
          description: 'Issue ID or identifier (e.g., "POS-123")',
        },
        title: {
          type: 'string',
          description: 'New issue title',
        },
        description: {
          type: 'string',
          description: 'New issue description in markdown',
        },
        priority: {
          type: 'string',
          enum: ['urgent', 'high', 'medium', 'low'],
          description: 'New priority',
        },
        status: {
          type: 'string',
          description: 'New status/state name',
        },
        project: {
          type: 'string',
          description: 'New project name or ID',
        },
        assignee: {
          type: 'string',
          description: 'New assignee username, email, or display name',
        },
        labels: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'New array of label/tag names',
        },
      },
      required: ['issueId'],
    },
  },
  {
    name: 'linear_list_issues',
    description: 'List Linear issues from the configured team. Supports filtering by status and assignee. Returns up to 50 issues by default (configurable with limit).',
    inputSchema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          description: 'Filter by status/state name',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of issues to return (default: 50)',
        },
        assigneeId: {
          type: 'string',
          description: 'Filter by assignee ID',
        },
      },
    },
  },
  {
    name: 'linear_get_issue',
    description: 'Get detailed information about a specific Linear issue by ID or identifier (e.g., "POS-123"). Returns full issue details including description, state, priority, and assignee.',
    inputSchema: {
      type: 'object',
      properties: {
        issueId: {
          type: 'string',
          description: 'Issue ID or identifier (e.g., "POS-123")',
        },
      },
      required: ['issueId'],
    },
  },
  {
    name: 'linear_delete_issue',
    description: 'Permanently delete a Linear issue by ID or identifier. This action cannot be undone. Use with caution.',
    inputSchema: {
      type: 'object',
      properties: {
        issueId: {
          type: 'string',
          description: 'Issue ID or identifier to delete',
        },
      },
      required: ['issueId'],
    },
  },
];

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools,
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'linear_list_teams': {
        ListTeamsArgsSchema.parse(args);
        const teams = await listTeams();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(teams, null, 2),
            },
          ],
        };
      }

      case 'linear_create_issue': {
        const validatedArgs = CreateIssueArgsSchema.parse(args);
        const params: CreateIssueParams = {
          title: validatedArgs.title,
          description: validatedArgs.description,
          priority: validatedArgs.priority,
          status: validatedArgs.status,
          project: validatedArgs.project,
          assignee: validatedArgs.assignee,
          labels: validatedArgs.labels,
        };
        const issue = await createIssue(params);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(issue, null, 2),
            },
          ],
        };
      }

      case 'linear_update_issue': {
        const validatedArgs = UpdateIssueArgsSchema.parse(args);
        const params: UpdateIssueParams = {
          issueId: validatedArgs.issueId,
          title: validatedArgs.title,
          description: validatedArgs.description,
          priority: validatedArgs.priority,
          status: validatedArgs.status,
          project: validatedArgs.project,
          assignee: validatedArgs.assignee,
          labels: validatedArgs.labels,
        };
        const issue = await updateIssue(params);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(issue, null, 2),
            },
          ],
        };
      }

      case 'linear_list_issues': {
        const validatedArgs = ListIssuesArgsSchema.parse(args);
        const params: ListIssuesParams = {
          status: validatedArgs.status,
          limit: validatedArgs.limit,
          assigneeId: validatedArgs.assigneeId,
        };
        const issues = await listIssues(params);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(issues, null, 2),
            },
          ],
        };
      }

      case 'linear_get_issue': {
        const validatedArgs = GetIssueArgsSchema.parse(args);
        const issue = await getIssue(validatedArgs.issueId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(issue, null, 2),
            },
          ],
        };
      }

      case 'linear_delete_issue': {
        const validatedArgs = DeleteIssueArgsSchema.parse(args);
        const result = await deleteIssue(validatedArgs.issueId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('Linear MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
