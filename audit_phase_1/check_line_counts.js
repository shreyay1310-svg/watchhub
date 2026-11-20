import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getFiles(dir, exts, results = []) {
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === 'node_modules' || file === '.git' || file === 'dist' || file === 'build') continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getFiles(fullPath, exts, results);
    } else {
      const ext = path.extname(file);
      if (exts.includes(ext)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

const exts = ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'];
const clientFiles = getFiles(path.resolve(__dirname, '../client/src'), exts);
const serverFiles = getFiles(path.resolve(__dirname, '../server/src'), exts);
const configFiles = [path.resolve(__dirname, '../client/vite.config.js')].filter(f => fs.existsSync(f));
const allFiles = [...clientFiles, ...serverFiles, ...configFiles].sort();

const over800 = [];
let csv = 'File_Path,Line_Count,Max_Allowed,Status,Notes\n';

for (const f of allFiles) {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n').length;
  const relPath = path.relative(path.resolve(__dirname, '..'), f).replace(/\\/g, '/');
  const status = lines <= 800 ? 'COMPLIANT' : 'NON_COMPLIANT';
  if (lines > 800) {
    over800.push({ path: relPath, lines });
  }
  csv += `"${relPath}",${lines},800,${status},"${lines <= 800 ? 'Within 800-line modular limit' : 'EXCEEDS LIMIT'}"\n`;
}

fs.writeFileSync(path.resolve(__dirname, 'PHASE_1_800_LINE_FINAL_SCAN.csv'), csv);

over800.sort((a, b) => b.lines - a.lines);

console.log(`Total files scanned: ${allFiles.length}`);
console.log(`Files exceeding 800 lines: ${over800.length}\n`);
for (const item of over800) {
  console.log(`${item.lines.toString().padStart(5, ' ')} lines : ${item.path}`);
}
