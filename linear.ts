import { LinearClient } from '@linear/sdk';
import * as dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.LINEAR_API_KEY;
const teamId = process.env.LINEAR_TEAM_ID;

if (!apiKey) {
  throw new Error('LINEAR_API_KEY is not set in .env file');
}

const client = new LinearClient({ apiKey });

export interface CreateIssueParams {
  title: string;
  description?: string;
  priority?: 'urgent' | 'high' | 'medium' | 'low';
  labels?: string[];
  status?: string;
  project?: string;
  assignee?: string;
}

export interface ListIssuesParams {
  status?: string;
  limit?: number;
  assigneeId?: string;
}

const priorityMap = {
  urgent: 1,
  high: 2,
  medium: 3,
  low: 4,
};

export async function listTeams() {
  const teams = await client.teams();
  const teamList = [];

  for (const team of teams.nodes) {
    teamList.push({
      id: team.id,
      name: team.name,
      key: team.key,
    });
  }

  return teamList;
}

async function findStateByName(teamId: string, stateName: string) {
  const team = await client.team(teamId);
  const states = await team.states();

  for (const state of states.nodes) {
    if (state.name.toLowerCase() === stateName.toLowerCase()) {
      return state.id;
    }
  }

  return null;
}

async function findProjectByName(projectNameOrId: string) {
  const projects = await client.projects();

  for (const project of projects.nodes) {
    if (project.id === projectNameOrId || project.name.toLowerCase().includes(projectNameOrId.toLowerCase())) {
      return project.id;
    }
  }

  return null;
}

async function findUserByUsername(username: string) {
  const users = await client.users();

  for (const user of users.nodes) {
    if (user.email?.toLowerCase().includes(username.toLowerCase()) ||
        user.name.toLowerCase().includes(username.toLowerCase()) ||
        user.displayName.toLowerCase().includes(username.toLowerCase())) {
      return user.id;
    }
  }

  return null;
}

async function findLabelsByNames(teamId: string, labelNames: string[]) {
  const team = await client.team(teamId);
  const labels = await team.labels();
  const labelIds: string[] = [];

  for (const labelName of labelNames) {
    for (const label of labels.nodes) {
      if (label.name.toLowerCase() === labelName.toLowerCase()) {
        labelIds.push(label.id);
        break;
      }
    }
  }

  return labelIds;
}

export async function createIssue(params: CreateIssueParams) {
  if (!teamId) {
    throw new Error('LINEAR_TEAM_ID is not set in .env file. Run listTeams() to find your team ID.');
  }

  const issueData: any = {
    teamId,
    title: params.title,
  };

  if (params.description) {
    issueData.description = params.description;
  }

  if (params.priority) {
    issueData.priority = priorityMap[params.priority];
  }

  if (params.status) {
    const stateId = await findStateByName(teamId, params.status);
    if (stateId) {
      issueData.stateId = stateId;
    }
  }

  if (params.project) {
    const projectId = await findProjectByName(params.project);
    if (projectId) {
      issueData.projectId = projectId;
    }
  }

  if (params.assignee) {
    const userId = await findUserByUsername(params.assignee);
    if (userId) {
      issueData.assigneeId = userId;
    }
  }

  if (params.labels && params.labels.length > 0) {
    const labelIds = await findLabelsByNames(teamId, params.labels);
    if (labelIds.length > 0) {
      issueData.labelIds = labelIds;
    }
  }

  const issuePayload = await client.createIssue(issueData);
  const issue = await issuePayload.issue;

  if (!issue) {
    throw new Error('Failed to create issue');
  }

  return {
    id: issue.id,
    identifier: issue.identifier,
    title: issue.title,
    url: issue.url,
    state: issue.state ? await issue.state.then(s => s?.name) : undefined,
  };
}

export async function getIssue(issueId: string) {
  const issue = await client.issue(issueId);

  if (!issue) {
    throw new Error(`Issue ${issueId} not found`);
  }

  const state = await issue.state;
  const assignee = await issue.assignee;

  return {
    id: issue.id,
    identifier: issue.identifier,
    title: issue.title,
    description: issue.description,
    url: issue.url,
    state: state?.name,
    priority: issue.priority,
    assignee: assignee ? {
      id: assignee.id,
      name: assignee.name,
      email: assignee.email,
    } : undefined,
  };
}

export async function listIssues(params?: ListIssuesParams) {
  if (!teamId) {
    throw new Error('LINEAR_TEAM_ID is not set in .env file. Run listTeams() to find your team ID.');
  }

  const team = await client.team(teamId);
  const issuesQuery = await team.issues({
    first: params?.limit || 50,
  });

  const issues = [];

  for (const issue of issuesQuery.nodes) {
    const state = await issue.state;
    const assignee = await issue.assignee;

    if (params?.status && state?.name.toLowerCase() !== params.status.toLowerCase()) {
      continue;
    }

    if (params?.assigneeId && assignee?.id !== params.assigneeId) {
      continue;
    }

    issues.push({
      id: issue.id,
      identifier: issue.identifier,
      title: issue.title,
      url: issue.url,
      state: state?.name,
      priority: issue.priority,
      assignee: assignee ? {
        id: assignee.id,
        name: assignee.name,
      } : undefined,
    });
  }

  return issues;
}

export async function deleteIssue(issueId: string) {
  const issue = await client.issue(issueId);

  if (!issue) {
    throw new Error(`Issue ${issueId} not found`);
  }

  const deletePayload = await client.deleteIssue(issue.id);
  const success = deletePayload.success;

  if (!success) {
    throw new Error(`Failed to delete issue ${issueId}`);
  }

  return {
    success: true,
    issueId: issueId,
  };
}
