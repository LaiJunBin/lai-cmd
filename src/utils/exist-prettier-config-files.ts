import fs from 'fs';

export function existPrettierConfigFiles(): boolean {
  return fs.readdirSync('.').some((fileName) => {
    return fileName.startsWith('.prettierrc');
  });
}
