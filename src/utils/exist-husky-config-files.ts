import { existsSync } from 'fs';

export function existHuskyConfigFiles(): boolean {
  return existsSync('.husky/pre-commit');
}
