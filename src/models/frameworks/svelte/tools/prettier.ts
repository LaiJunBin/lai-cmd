import { getPrettierConfigFileName } from '../../../../utils/prettier';
import { Framework } from '../../framework';
import { Tool } from '../../../tool';
import {
  existESLintConfigFiles,
  getESLintConfigFileName,
} from '../../../../utils/eslint';
import { ConfigParser } from 'config-parser-master';
import fs from 'fs';
import { addVSCodeExtensionsToRecommendations } from '../../../../utils/vscode';
import { green, yellow } from 'kolorist';

async function installDependencies(framework: Framework) {
  console.log(green('Install Prettier and Prettier Svelte plugin'));
  const installedPackages = ['prettier@2', 'prettier-plugin-svelte'];
  await framework.packageManager.install(installedPackages, true);
}

async function installDependenciesForESLint(framework: Framework) {
  console.log(green('Install ESLint Prettier plugin'));
  const installedPackages = [
    'eslint-plugin-prettier@4',
    'eslint-config-prettier',
  ];
  await framework.packageManager.install(installedPackages, true);
}

function updateESLintConfigFile() {
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

function updatePrettierConfigFile() {
  console.log(green('Update Prettier config file'));
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
  "singleQuote": true,
}`
    );
  }

  const config = ConfigParser.parse(configFile);
  const plugins = config.get('plugins', []) as Array<string>;
  if (!plugins.includes('prettier-plugin-svelte')) {
    plugins.push('prettier-plugin-svelte');
  }
  config.put('plugins', plugins);

  const overrides = config.get('overrides', []) as Array<any>;
  if (!overrides.find((override) => override.files === '*.svelte')) {
    overrides.push({
      files: '*.svelte',
      options: {
        parser: 'svelte',
      },
    });
  }
  config.put('overrides', overrides);
  config.save();
}

async function addScript(framework: Framework) {
  console.log(green('Add format script'));
  if (framework.packageManager.hasScript('format')) {
    console.log(yellow('Format script already exists, skip'));
    return;
  }
  await framework.packageManager.addScript(
    'format',
    'prettier --write src/**/*.{ts,js,json,md}'
  );
}

function updateVSCodeExtensionsFile() {
  console.log(green('Update VSCode extensions file'));
  const extensions = ['esbenp.prettier-vscode', 'dbaeumer.vscode-eslint'];
  addVSCodeExtensionsToRecommendations(extensions);
}

const install = async (framework: Framework) => {
  console.log(green('Prettier install'));
  await installDependencies(framework);
  if (existESLintConfigFiles()) {
    console.log(
      yellow('ESLint config file found, install ESLint Prettier plugin')
    );
    await installDependenciesForESLint(framework);
    updateESLintConfigFile();
  }

  updatePrettierConfigFile();
  await addScript(framework);
  updateVSCodeExtensionsFile();
};

export const Prettier = new Tool.Builder()
  .setInstall(install)
  .setPromptChoice({
    title: 'Prettier',
  })
  .build();
