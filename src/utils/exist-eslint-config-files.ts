import fs from 'fs';

export function existESLintConfigFiles(): boolean {
  return fs.readdirSync('.').some((fileName) => {
    return fileName.startsWith('.eslintrc');
  });
}
