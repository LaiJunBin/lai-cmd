import { Framework } from '@/models/framework';
import { Tool } from '@/models/tool';
import {
  addLintScript,
  createESLintConfig,
  getESLintConfigFileName,
  updateVSCodeExtensionsFileForESLint,
  updateVSCodeSettingsForESLint,
} from '@/utils/eslint';
import { ConfigParser } from 'config-parser-master';
import { PackageManager } from '@/lib/package-manager';
import { green, yellow } from 'kolorist';
import { Tools } from '@/const/tools';

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

const install = async (framework: Framework) => {
  console.log(green('ESLint install'));
  await createESLintConfig(framework);
  await installDependencies(framework);
  await updateConfigFile(framework);
  await addLintScript(framework, ['ts', 'js', 'json', 'svelte']);
  updateVSCodeSettingsForESLint();
  updateVSCodeExtensionsFileForESLint();
};

export const ESLint = new Tool.Builder()
  .setInstall(install)
  .setPromptChoice({
    title: Tools.ESLint,
  })
  .build();
