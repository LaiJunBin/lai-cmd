import fs from 'fs';

export function getInitialPackageManager() {
  const files = fs.readdirSync('.');
  if (files.includes('package-lock.json')) {
    return 'npm';
  }

  if (files.includes('yarn.lock')) {
    return 'yarn';
  }

  if (files.includes('pnpm-lock.yaml')) {
    return 'pnpm';
  }

  return 'npm';
}
