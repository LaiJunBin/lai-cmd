import fs from 'fs';

export function existHuskyConfigFiles(): boolean {
  return fs.existsSync('.husky/pre-commit');
}
