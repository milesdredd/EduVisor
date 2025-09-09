import 'dotenv/config';
import { spawn } from 'child_process';

spawn('drizzle-kit', process.argv.slice(2), { stdio: 'inherit' });
