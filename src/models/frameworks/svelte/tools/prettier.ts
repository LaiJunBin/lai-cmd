import {
  existPrettierConfigFiles,
  getPrettierConfigFileName,
} from '../../../../utils/prettier';
import { Framework } from '../../framework';
import { Tool } from '../../../tool';
import {
  existESLintConfigFiles,
  getESLintConfigFileName,
} from '../../../../utils/eslint';
import { ConfigParser } from 'config-parser-master';
import fs from 'fs';
import { addVSCodeExtensionsToRecommendations } from '../../../../utils/vscode';

async function installDependencies(framework: Framework) {
  const installedPackages = ['prettier@2', 'prettier-plugin-svelte'];
  await framework.packageManager.install(installedPackages, true);
}

async function installDependenciesForESLint(framework: Framework) {
  const installedPackages = [
    'eslint-plugin-prettier@4',
    'eslint-config-prettier',
  ];
  await framework.packageManager.install(installedPackages, true);
}

function updateESLintConfigFile() {
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
  let configFile = getPrettierConfigFileName();
  if (!configFile) {
    console.log('Prettier config file not found, create .prettierrc');
    configFile = '.prettierrc';
    fs.writeFileSync(configFile, '{}');
  }

  const config = ConfigParser.parse(configFile);
  config.put('trailingComma', 'es5');
  config.put('tabWidth', 2);
  config.put('semi', false);
  config.put('singleQuote', true);
  config.put('plugins', ['prettier-plugin-svelte']);
  config.put('overrides', [
    {
      files: '*.svelte',
      options: {
        parser: 'svelte',
      },
    },
  ]);
  config.save();
}

async function addScript(framework: Framework) {
  await framework.packageManager.addScript(
    'format',
    'prettier --write src/**/*.{ts,js,json,md}'
  );
}

function updateVSCodeExtensionsFile() {
  const extensions = ['esbenp.prettier-vscode', 'dbaeumer.vscode-eslint'];
  addVSCodeExtensionsToRecommendations(extensions);
}

const install = async (framework: Framework) => {
  console.log('Prettier install');
  await installDependencies(framework);
  if (existESLintConfigFiles()) {
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
    disabled: existPrettierConfigFiles(),
  })
  .build();
