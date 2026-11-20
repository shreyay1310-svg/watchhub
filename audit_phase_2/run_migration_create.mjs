import fs from 'fs';
import { execSync } from 'child_process';

const testUrls = [
  'sqlserver://127.0.0.1:1433;database=WatchHubDB;integratedSecurity=true;trustServerCertificate=true',
  'sqlserver://localhost:1433;database=WatchHubDB;trusted_connection=true;trustServerCertificate=true',
];

for (const dbUrl of testUrls) {
  console.log('Testing migrate diff with URL:', dbUrl);
  try {
    const out = execSync('npx --yes prisma@6 migrate diff --from-empty --to-schema-datamodel=server/prisma/schema.prisma --script', {
      env: { ...process.env, DATABASE_URL: dbUrl },
      encoding: 'utf8',
    });
    console.log('SUCCESS: Generated DDL script of length:', out.length);
    fs.writeFileSync('audit_phase_2/init_watchhub_mssql.sql', out, 'utf8');
    break;
  } catch (e) {
    console.log('Output:', e.stdout || e.message);
  }
}
