import { Framework } from '../../framework';
import { Tool } from '../../../tool';
import {
  existESLintConfigFiles,
  getESLintConfigFileName,
} from '../../../../utils/eslint';
import { ConfigParser } from 'config-parser-master';
import { PackageManager } from '../../../package-manager';
import {
  addVSCodeExtensionsToRecommendations,
  getVSCodeSettingsFileName,
} from '../../../../utils/vscode';
import { green, yellow } from 'kolorist';

async function createESLintConfig(framework: Framework) {
  console.log(green('Create ESLint config file'));
  if (existESLintConfigFiles()) {
    console.log(yellow('ESLint config file already exists, skip creating'));
    return;
  }

  await framework.packageManager.create('@eslint/config');
}

async function installDependencies(framework: Framework) {
  console.log(green('Install ESLint svelte plugin'));
  await framework.packageManager.install(['eslint-plugin-svelte'], true);
}

async function updateConfigFile(framework: Framework) {
  console.log(green('Update ESLint config file'));
  const configFile = getESLintConfigFileName();
  const config = ConfigParser.parse(configFile);
  let configExtends = config.get('extends');
  if (!Array.isArray(configExtends)) {
    configExtends = [configExtends];
  }
  if (!configExtends.includes('plugin:svelte/recommended')) {
    configExtends.push('plugin:svelte/recommended');
  }

  if (await PackageManager.isInstalled('typescript')) {
    console.log(green('Update ESLint config file for TypeScript'));
    if (
      await PackageManager.isInstalled('eslint-config-standard-with-typescript')
    ) {
      console.log(yellow('Uninstall eslint-config-standard-with-typescript'));
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
    } else if (
      !configExtends.includes('plugin:@typescript-eslint/recommended')
    ) {
      configExtends.push('plugin:@typescript-eslint/recommended');
    }

    const overrides = config.get('overrides', []);
    if (!overrides.find((override) => override.files.includes('*.svelte'))) {
      overrides.push({
        files: ['*.svelte'],
        parser: 'svelte-eslint-parser',
        parserOptions: {
          parser: '@typescript-eslint/parser',
        },
      });
    }
    config.put('overrides', overrides);
  }

  config.put('extends', configExtends);

  config.save();
}

async function addScript(framework: Framework) {
  console.log(green('Add lint script'));
  if (framework.packageManager.hasScript('lint')) {
    console.log(yellow('Lint script already exists, skip adding'));
    return;
  }

  await framework.packageManager.addScript(
    'lint',
    'eslint --fix src/**/*.{ts,js,json,md}'
  );
}

function addVSCodeSettings() {
  console.log(green('Add VSCode settings'));
  const settings = {
    'eslint.validate': ['svelte'],
    'eslint.options': {
      extensions: ['.svelte'],
    },
    'editor.codeActionsOnSave': {
      'source.fixAll.eslint': true,
    },
  };
  const vscodeSettingsFile = getVSCodeSettingsFileName();
  const config = ConfigParser.parse(vscodeSettingsFile);
  config.put(`"eslint.validate"`, settings['eslint.validate']);
  config.put(`"eslint.options"`, settings['eslint.options']);
  config.put(
    `"editor.codeActionsOnSave"`,
    settings['editor.codeActionsOnSave']
  );
  config.save();
}

function updateVSCodeExtensionsFile() {
  console.log(green('Update VSCode extensions file'));
  const extensions = ['dbaeumer.vscode-eslint'];
  addVSCodeExtensionsToRecommendations(extensions);
}

const install = async (framework: Framework) => {
  console.log(green('ESLint install'));
  await createESLintConfig(framework);
  await installDependencies(framework);
  await updateConfigFile(framework);
  await addScript(framework);
  addVSCodeSettings();
  updateVSCodeExtensionsFile();
};

export const ESLint = new Tool.Builder()
  .setInstall(install)
  .setPromptChoice({
    title: 'ESLint',
  })
  .build();
