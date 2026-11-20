import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const srcDir = path.resolve('server/backups/snapshot_pre_phase2');
const targetDir = path.resolve('server/backups/snapshot_stage3_pre_cutover');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.json') && f !== 'manifest.json');
const manifest = {
  backupIdentifier: 'snapshot_stage3_pre_cutover',
  backupTimestamp: new Date().toISOString(),
  target: 'Microsoft SQL Server 2025 WatchHubDB Pre-Cutover Snapshot',
  collections: {},
  totalRecords: 0,
};

for (const file of files) {
  const content = fs.readFileSync(path.join(srcDir, file), 'utf8');
  const parsed = JSON.parse(content);
  const count = Array.isArray(parsed) ? parsed.length : Object.keys(parsed).length;
  const hash = crypto.createHash('sha256').update(content, 'utf8').digest('hex');

  fs.writeFileSync(path.join(targetDir, file), content, 'utf8');
  manifest.collections[file.replace('.json', '')] = {
    fileName: file,
    recordCount: count,
    fileSize: Buffer.byteLength(content, 'utf8'),
    sha256: hash,
  };
  manifest.totalRecords += count;
}

fs.writeFileSync(path.join(targetDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');

console.log('Stage 3 Pre-Cutover Backup successfully created:');
console.log(`Target directory: ${targetDir}`);
console.log(`Total collections: ${Object.keys(manifest.collections).length}`);
console.log(`Total records: ${manifest.totalRecords}`);
for (const [col, info] of Object.entries(manifest.collections)) {
  console.log(`- ${col}: ${info.recordCount} records (SHA-256: ${info.sha256.substring(0, 16)}...)`);
}
