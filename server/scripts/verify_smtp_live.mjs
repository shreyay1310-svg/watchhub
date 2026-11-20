import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { verifyGmailSmtp } from '../src/services/googleEmailService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function checkSmtp() {
  console.log('Testing Gmail SMTP Connection & Credentials...');
  const res = await verifyGmailSmtp();
  console.log('SMTP Verification Result:', res);
}

checkSmtp();
