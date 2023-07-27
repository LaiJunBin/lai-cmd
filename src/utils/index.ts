import { PackageManager } from '@/lib/package-manager';
import { ConfigParser } from 'config-parser-master';
import fs from 'fs';
import { green } from 'kolorist';

export const getDevLanguage = () => {
  const config = ConfigParser.parse('./package.json');
  const dependencies = [
    ...Object.keys(config.get('dependencies', [])),
    ...Object.keys(config.get('devDependencies', [])),
  ];

  if (dependencies.includes('typescript')) {
    return 'ts';
  }

  return 'js';
};

export async function getScriptConfigFile() {
  if (
    fs.existsSync('tsconfig.json') ||
    (await PackageManager.isInstalled('typescript'))
  ) {
    return 'tsconfig.json';
  }

  return 'jsconfig.json';
}

export const writeFileSync = (path: string, source: string) => {
  const directory = path.split('/').slice(0, -1).join('/');
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  fs.writeFileSync(path, source);
  console.log(green(`Create ${path} successfully`));
};

export const writeFileSyncIfNotExist = (path: string, source: string) => {
  if (fs.existsSync(path)) {
    console.log(green(`${path} already exists, skip`));
    return;
  }

  writeFileSync(path, source);
};
