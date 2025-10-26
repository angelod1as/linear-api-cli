#!/usr/bin/env node

import { Command } from 'commander';
import { createIssue, listIssues, getIssue, listTeams, deleteIssue } from './linear.js';

const program = new Command();

program
  .name('linear')
  .description('CLI for Linear API - LLM-friendly, non-interactive')
  .version('1.0.0');

program
  .command('teams')
  .description('List all available teams')
  .action(async () => {
    try {
      const teams = await listTeams();
      console.log('\nAvailable teams:');
      console.log('================\n');
      teams.forEach((team) => {
        console.log(`${team.name} (${team.key})`);
        console.log(`  ID: ${team.id}\n`);
      });
    } catch (error: any) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

program
  .command('create')
  .description('Create a new Linear issue')
  .requiredOption('--title <title>', 'Issue title')
  .option('--description <description>', 'Issue description')
  .option('--priority <priority>', 'Priority: urgent, high, medium, low')
  .option('--status <status>', 'Status/State name (e.g., Todo, In Progress)')
  .option('--project <project>', 'Project name or ID')
  .option('--assignee <assignee>', 'Assignee username/email')
  .option('--tag <tags...>', 'Tags/Labels (can be used multiple times)')
  .action(async (options) => {
    try {
      const params: any = {
        title: options.title,
      };

      if (options.description) params.description = options.description;
      if (options.priority) params.priority = options.priority;
      if (options.status) params.status = options.status;
      if (options.project) params.project = options.project;
      if (options.assignee) params.assignee = options.assignee;
      if (options.tag) params.labels = options.tag;

      const issue = await createIssue(params);

      console.log('\n✓ Issue created successfully!\n');
      console.log(`  ID: ${issue.identifier}`);
      console.log(`  Title: ${issue.title}`);
      console.log(`  URL: ${issue.url}`);
      if (issue.state) console.log(`  State: ${issue.state}`);
      console.log('');
    } catch (error: any) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

program
  .command('list')
  .description('List Linear issues')
  .option('--status <status>', 'Filter by status/state')
  .option('--limit <limit>', 'Max number of issues to return', '50')
  .option('--assignee <assigneeId>', 'Filter by assignee ID')
  .action(async (options) => {
    try {
      const params: any = {
        limit: parseInt(options.limit),
      };

      if (options.status) params.status = options.status;
      if (options.assignee) params.assigneeId = options.assignee;

      const issues = await listIssues(params);

      if (issues.length === 0) {
        console.log('\nNo issues found.');
        return;
      }

      console.log(`\nFound ${issues.length} issue(s):\n`);
      issues.forEach((issue) => {
        console.log(`[${issue.identifier}] ${issue.title}`);
        console.log(`  State: ${issue.state || 'N/A'}`);
        if (issue.assignee) {
          console.log(`  Assignee: ${issue.assignee.name}`);
        }
        console.log(`  URL: ${issue.url}\n`);
      });
    } catch (error: any) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

program
  .command('get')
  .description('Get a specific issue')
  .argument('<issueId>', 'Issue ID or identifier (e.g., POS-123)')
  .action(async (issueId) => {
    try {
      const issue = await getIssue(issueId);

      console.log(`\n[${issue.identifier}] ${issue.title}\n`);
      console.log(`Description: ${issue.description || 'N/A'}`);
      console.log(`State: ${issue.state || 'N/A'}`);
      console.log(`Priority: ${issue.priority || 'N/A'}`);
      if (issue.assignee) {
        console.log(`Assignee: ${issue.assignee.name} (${issue.assignee.email})`);
      }
      console.log(`URL: ${issue.url}\n`);
    } catch (error: any) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

program
  .command('delete')
  .description('Delete a Linear issue')
  .argument('<issueId>', 'Issue ID or identifier (e.g., POS-123)')
  .action(async (issueId) => {
    try {
      const result = await deleteIssue(issueId);

      console.log(`\n✓ Issue ${result.issueId} deleted successfully!\n`);
    } catch (error: any) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

program.parse();
