import { execSync } from 'child_process';

console.log('Generating fresh package-lock.json...');
try {
  execSync('npm install --legacy-peer-deps --package-lock-only', {
    cwd: '/vercel/share/v0-project',
    stdio: 'inherit',
  });
  console.log('Done! package-lock.json generated.');
} catch (err) {
  console.error('npm install failed:', err.message);
  // Fallback: try without legacy peer deps
  try {
    execSync('npm install --package-lock-only', {
      cwd: '/vercel/share/v0-project',
      stdio: 'inherit',
    });
    console.log('Done with fallback! package-lock.json generated.');
  } catch (err2) {
    console.error('Fallback also failed:', err2.message);
    process.exit(1);
  }
}
