import { existsSync } from 'fs';

export function existESLintConfigFiles(): boolean {
  return (
    existsSync('.eslintrc.json') ||
    existsSync('.eslintrc.cjs') ||
    existsSync('.eslintrc.yml')
  );
}
