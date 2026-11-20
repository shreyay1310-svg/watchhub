import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (!full.includes('node_modules') && !full.includes('.git') && !full.includes('dist')) {
        results = results.concat(walk(full));
      }
    } else if (/\.(js|jsx|mjs|ts|tsx|prisma)$/.test(file)) {
      results.push(full);
    }
  }
  return results;
}

const dirs = ['server/src', 'server/scripts', 'client/src'];
const allFiles = dirs.flatMap(d => walk(d));
let over800 = [];

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const count = content.split('\n').length;
  if (count > 800) {
    over800.push({ file, count });
  }
}

console.log(`\n================ LINE COUNT COMPLIANCE REPORT ================`);
console.log(`Total files scanned: ${allFiles.length}`);
console.log(`Files exceeding 800 lines: ${over800.length}`);

if (over800.length > 0) {
  console.log(`\nViolating files:`);
  for (const item of over800) {
    console.log(`- ${item.file}: ${item.count} lines`);
  }
  process.exit(1);
} else {
  console.log(`\n100% COMPLIANT: All files are within the 800-line limit.`);
  process.exit(0);
}
