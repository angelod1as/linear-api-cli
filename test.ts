import { createIssue, listIssues, getIssue, listTeams } from './linear.js';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  duration?: number;
}

const results: TestResult[] = [];

function logTest(name: string, passed: boolean, error?: string, duration?: number) {
  results.push({ name, passed, error, duration });
  const status = passed ? '✓' : '✗';
  const color = passed ? '\x1b[32m' : '\x1b[31m';
  const reset = '\x1b[0m';
  const durationStr = duration ? ` (${duration}ms)` : '';
  console.log(`${color}${status}${reset} ${name}${durationStr}`);
  if (error) {
    console.log(`  ${color}Error: ${error}${reset}`);
  }
}

async function runTests() {
  console.log('\n🧪 Running Linear API Tests\n');
  console.log('============================\n');

  let testIssueId: string | undefined;

  // Test 1: List Teams
  try {
    const start = Date.now();
    const teams = await listTeams();
    const duration = Date.now() - start;

    if (teams.length === 0) {
      logTest('List teams', false, 'No teams found', duration);
    } else {
      logTest('List teams', true, undefined, duration);
      console.log(`  Found ${teams.length} team(s)`);
    }
  } catch (error: any) {
    logTest('List teams', false, error.message);
  }

  // Test 2: Create Issue
  try {
    const start = Date.now();
    const issue = await createIssue({
      title: '[TEST] API Test Issue - Please Delete',
      description: 'This is an automated test issue. Feel free to delete.',
      priority: 'low',
    });
    const duration = Date.now() - start;

    testIssueId = issue.identifier;
    logTest('Create issue', true, undefined, duration);
    console.log(`  Created: ${issue.identifier}`);
  } catch (error: any) {
    logTest('Create issue', false, error.message);
  }

  // Test 3: List Issues
  try {
    const start = Date.now();
    const issues = await listIssues({ limit: 5 });
    const duration = Date.now() - start;

    if (issues.length === 0) {
      logTest('List issues', false, 'No issues found', duration);
    } else {
      logTest('List issues', true, undefined, duration);
      console.log(`  Found ${issues.length} issue(s)`);
    }
  } catch (error: any) {
    logTest('List issues', false, error.message);
  }

  // Test 4: Get Issue (if we created one)
  if (testIssueId) {
    try {
      const start = Date.now();
      const issue = await getIssue(testIssueId);
      const duration = Date.now() - start;

      if (issue.identifier === testIssueId) {
        logTest('Get issue', true, undefined, duration);
        console.log(`  Retrieved: ${issue.identifier}`);
      } else {
        logTest('Get issue', false, 'Issue ID mismatch', duration);
      }
    } catch (error: any) {
      logTest('Get issue', false, error.message);
    }
  } else {
    logTest('Get issue', false, 'Skipped (no test issue created)');
  }

  // Test 5: Create Issue with All Options
  try {
    const start = Date.now();
    const issue = await createIssue({
      title: '[TEST] Full Options Test - Please Delete',
      description: 'Testing all create options',
      priority: 'low',
      status: 'Backlog',
      labels: ['Test'],
    });
    const duration = Date.now() - start;

    logTest('Create issue with options', true, undefined, duration);
    console.log(`  Created: ${issue.identifier}`);
  } catch (error: any) {
    logTest('Create issue with options', false, error.message);
  }

  // Test 6: List Issues with Filter
  try {
    const start = Date.now();
    const issues = await listIssues({ status: 'Backlog', limit: 3 });
    const duration = Date.now() - start;

    logTest('List issues with filter', true, undefined, duration);
    console.log(`  Found ${issues.length} backlog issue(s)`);
  } catch (error: any) {
    logTest('List issues with filter', false, error.message);
  }

  // Summary
  console.log('\n============================\n');
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const total = results.length;

  if (failed === 0) {
    console.log(`✅ All tests passed! (${passed}/${total})\n`);
    console.log('⚠️  Note: Test issues were created in Linear. Please delete them manually.');
    process.exit(0);
  } else {
    console.log(`❌ Some tests failed: ${passed} passed, ${failed} failed (${total} total)\n`);
    console.log('Failed tests:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  - ${r.name}: ${r.error}`);
    });
    process.exit(1);
  }
}

// Check environment variables first
console.log('🔍 Checking environment configuration...\n');

const apiKey = process.env.LINEAR_API_KEY;
const teamId = process.env.LINEAR_TEAM_ID;

if (!apiKey) {
  console.error('❌ LINEAR_API_KEY is not set in .env file');
  console.error('   Please add your Linear API key to .env\n');
  process.exit(1);
}

if (!teamId) {
  console.error('❌ LINEAR_TEAM_ID is not set in .env file');
  console.error('   Run: pnpm linear:teams');
  console.error('   Then add the team ID to .env\n');
  process.exit(1);
}

console.log('✓ API Key configured');
console.log('✓ Team ID configured');

runTests().catch(error => {
  console.error('\n💥 Unexpected error:', error);
  process.exit(1);
});
