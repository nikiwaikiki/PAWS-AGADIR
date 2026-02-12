import { execSync } from 'child_process';
import { resolve } from 'path';

const projectDir = resolve(process.cwd(), '..');

try {
  console.log('Running npm install to generate fresh lockfile...');
  execSync('npm install --legacy-peer-deps', {
    cwd: projectDir,
    stdio: 'inherit',
    timeout: 120000,
  });
  console.log('Lockfile generated successfully.');
} catch (err) {
  console.error('Failed to generate lockfile:', err.message);
  process.exit(1);
}
