import { Framework } from '../../../framework';
import { Tool } from '../../../../tool';
import {
  existESLintConfigFiles,
  getESLintConfigFileName,
} from '../../../../../utils/eslint';
import { ChangeSvelte3ToSvelte } from './change-svelte3-to-svelte';
import { ConfigParser } from 'config-parser-master';
import { PackageManager } from '../../../../package-manager';
import {
  addVSCodeExtensionsToRecommendations,
  getVSCodeSettingsFileName,
} from '../../../../../utils/vscode';

async function createESLintConfig(framework: Framework) {
  await framework.packageManager.create('@eslint/config');
}

async function installDependencies(framework: Framework) {
  await framework.packageManager.install(['eslint-plugin-svelte'], true);
}

function updateConfigFile(framework: Framework) {
  const configFile = getESLintConfigFileName();
  const config = ConfigParser.parse(configFile);
  let configExtends = config.get('extends');
  if (!Array.isArray(configExtends)) {
    configExtends = [configExtends];
  }
  if (!configExtends.includes('plugin:svelte/recommended')) {
    configExtends.push('plugin:svelte/recommended');
  }

  if (PackageManager.isInstalled('typescript')) {
    if (PackageManager.isInstalled('eslint-config-standard-with-typescript')) {
      framework.packageManager.uninstall([
        'eslint-config-standard-with-typescript',
      ]);
    }

    framework.packageManager.install(
      ['@typescript-eslint/eslint-plugin', '@typescript-eslint/parser'],
      true
    );
    const index = configExtends.indexOf('standard-with-typescript');
    if (index !== -1) {
      configExtends.splice(index, 1, 'plugin:@typescript-eslint/recommended');
    } else {
      configExtends.push('plugin:@typescript-eslint/recommended');
    }
  }

  config.put('extends', configExtends);

  config.save();
}

async function addScript(framework: Framework) {
  await framework.packageManager.addScript(
    'lint',
    'eslint --fix src/**/*.{ts,js,json,md}'
  );
}

function addVSCodeSettings() {
  const settings = {
    'eslint.validate': ['svelte'],
    'eslint.options': {
      extensions: ['.svelte'],
    },
  };
  const vscodeSettingsFile = getVSCodeSettingsFileName();
  const config = ConfigParser.parse(vscodeSettingsFile);
  config.put('eslint.validate', settings['eslint.validate']);
  config.put('eslint.options', settings['eslint.options']);
  config.save();
}

function updateVSCodeExtensionsFile() {
  const extensions = ['dbaeumer.vscode-eslint'];
  addVSCodeExtensionsToRecommendations(extensions);
}

const install = async (framework: Framework) => {
  console.log('ESLint install');
  await createESLintConfig(framework);
  await installDependencies(framework);
  updateConfigFile(framework);
  await addScript(framework);
  addVSCodeSettings();
  updateVSCodeExtensionsFile();
};

export const ESLint = new Tool.Builder()
  .setInstall(install)
  .setPromptChoice({
    title: 'ESLint',
    disabled: existESLintConfigFiles(),
  })
  .setChildren([ChangeSvelte3ToSvelte])
  .build();
