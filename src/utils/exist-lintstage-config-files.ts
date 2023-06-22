import fs from 'fs';

export function existLintStagedConfigFiles(): boolean {
  return (
    fs.existsSync('.lintstagedrc') ||
    (fs.existsSync('package.json') &&
      JSON.parse(fs.readFileSync('package.json', 'utf-8')).hasOwnProperty(
        'lint-staged'
      ))
  );
}
