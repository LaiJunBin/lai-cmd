import { Framework } from '@/models/framework';
import fs from 'fs';
import { getESLintConfigFileName } from './eslint';
import { ConfigParser } from 'config-parser-master';
import { green, yellow } from 'kolorist';
import {
  addVSCodeExtensionsToRecommendations,
  putVSCodeSettings,
} from './vscode';

export function existPrettierConfigFiles(): boolean {
  return fs.readdirSync('.').some((fileName) => {
    return fileName.startsWith('.prettierrc');
  });
}

export function getPrettierConfigFileName(): string | null {
  const extension = ['.js', '.cjs', '.yml', '.json', ''].find((type) =>
    fs.existsSync(`.prettierrc${type}`)
  );

  if (extension === undefined) {
    return null;
  }

  return `.prettierrc${extension}`;
}

export async function installPrettierDependencies(
  framework: Framework,
  dependencies: string[]
) {
  const installedPackages = ['prettier@^2', ...dependencies];
  await framework.packageManager.install(installedPackages, true);
}

export async function installPrettierDependenciesForESLint(
  framework: Framework
) {
  console.log(green('Install ESLint Prettier plugin'));
  const installedPackages = [
    'eslint-plugin-prettier@^4',
    'eslint-config-prettier',
  ];
  await framework.packageManager.install(installedPackages, true);
}

export function updateESLintConfigFileForPrettier() {
  console.log(green('Update ESLint config file'));
  const eslintConfigFile = getESLintConfigFileName();
  const config = ConfigParser.parse(eslintConfigFile);
  let configExtends = config.get('extends');
  if (!Array.isArray(configExtends)) {
    configExtends = [configExtends];
  }
  if (!configExtends.includes('prettier')) {
    configExtends.push('prettier');
  }
  let plugins = config.get('plugins', []);
  if (!Array.isArray(plugins)) {
    plugins = [plugins];
  }
  if (!plugins.includes('prettier')) {
    plugins.push('prettier');
  }

  config.put('extends', configExtends);
  if (!config.get('rules.prettier/prettier')) {
    config.put('rules."prettier/prettier"', 'error');
  }
  config.put('plugins', plugins);
  config.save();
}

export function initPrettierConfigFile(): string {
  let configFile = getPrettierConfigFileName();
  if (!configFile) {
    console.log(yellow('Prettier config file not found, create .prettierrc'));
    configFile = '.prettierrc';
    fs.writeFileSync(
      configFile,
      `{
  "trailingComma": "es5",
  "tabWidth": 2,
  "semi": false,
  "singleQuote": true
}`
    );
  }

  return configFile;
}

export async function addFormatScript(
  framework: Framework,
  extensions: string[]
) {
  console.log(green('Add format script'));
  if (await framework.packageManager.hasScript('format')) {
    console.log(yellow('Format script already exists, skip'));
    return;
  }

  const extension = extensions.join(',');
  await framework.packageManager.addScript(
    'format',
    `prettier --write src/**/*.{${extension}}`
  );
}

export function updateVSCodeExtensionsFileForPrettier() {
  console.log(green('Update VSCode extensions file'));
  const extensions = ['esbenp.prettier-vscode'];
  addVSCodeExtensionsToRecommendations(extensions);
}

export function updateVSCodeSettingsForPrettier() {
  console.log(green('Update VSCode settings'));
  const settings = {
    '[jsonc]': {
      'editor.defaultFormatter': 'esbenp.prettier-vscode',
      'editor.formatOnSave': true,
    },
    '"files.associations"': {
      '*.json': 'jsonc',
      '.*rc': 'jsonc',
    },
  };

  putVSCodeSettings(settings);
}
