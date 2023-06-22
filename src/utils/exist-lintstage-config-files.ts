import { existsSync, readFileSync } from 'fs';

export function existLintStagedConfigFiles(): boolean {
  return (
    existsSync('.lintstagedrc') ||
    (existsSync('package.json') &&
      JSON.parse(readFileSync('package.json', 'utf-8')).hasOwnProperty(
        'lint-staged'
      ))
  );
}
