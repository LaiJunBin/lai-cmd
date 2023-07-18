import { PackageManager } from '../models/package-manager';
import fs from 'fs';

export const getDevLanguage = async () => {
  if (await PackageManager.isInstalled('typescript')) {
    return 'ts';
  }

  return 'js';
};

export const writeFileSync = (path: string, source: string) => {
  const directory = path.split('/').slice(0, -1).join('/');
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  fs.writeFileSync(path, source);
};
