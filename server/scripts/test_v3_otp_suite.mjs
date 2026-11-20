// WatchHub V3 OTP Persistence & Distributed Concurrency Test Suite Coordinator
// Executes TC_V3_001 through TC_V3_020 against Microsoft SQL Server 2025
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { runV3SuitePart1 } from './test_v3_otp_suite_part1.mjs';
import { runV3SuitePart2 } from './test_v3_otp_suite_part2.mjs';

const results = [];

function recordTest(id, name, status, details, evidence = null) {
  results.push({ id, name, status, details, evidence });
  const icon = status === 'PASS' ? '✔ [PASS]' : status === 'FAIL' ? '✘ [FAIL]' : '⚠ [BLOCKED]';
  console.log(`${icon} ${id}: ${name}`);
  if (details) console.log(`   Details: ${details}`);
}

async function runV3Suite() {
  console.log('================================================================');
  console.log('WATCHHUB OTP PERSISTENCE – V3 COMPREHENSIVE VERIFICATION SUITE');
  console.log('Target Database: Microsoft SQL Server 2025 (WatchHubDB)');
  console.log('ORM: Prisma 6.19.3 | Node.js Runtime: ' + process.version);
  console.log('================================================================\n');

  const testEmailPrefix = `tc_v3_${Date.now()}`;

  // Execute Part 1 (TC_V3_001 to TC_V3_010)
  await runV3SuitePart1(recordTest, testEmailPrefix);

  // Execute Part 2 (TC_V3_011 to TC_V3_020)
  await runV3SuitePart2(recordTest, testEmailPrefix);

  console.log('\n================================================================');
  console.log('TEST EXECUTION SUMMARY');
  console.log('================================================================');
  const total = results.length;
  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = results.filter((r) => r.status === 'FAIL').length;
  const blocked = results.filter((r) => r.status === 'BLOCKED').length;

  console.log(`TOTAL: ${total} | PASSED: ${passed} | FAILED: ${failed} | BLOCKED: ${blocked}`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
  process.exit(0);
}

runV3Suite().catch((err) => {
  console.error('[Fatal Test Suite Error]', err);
  process.exit(1);
});
