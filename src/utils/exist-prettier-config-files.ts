import { existsSync } from 'fs';

export function existPrettierConfigFiles(): boolean {
  return existsSync('.prettierrc.json') || existsSync('.prettierrc');
}
