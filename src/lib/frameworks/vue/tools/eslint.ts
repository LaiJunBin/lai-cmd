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
import { green, yellow } from 'kolorist';
import { Tools } from '@/const/tools';
import { PackageManager } from '@/lib/package-manager';

async function updateConfigFile(framework: Framework) {
  console.log(green('Update ESLint config file'));
  const configFile = getESLintConfigFileName();
  const config = ConfigParser.parse(configFile);
  let configExtends = config.get('extends');
  if (!Array.isArray(configExtends)) {
    configExtends = [configExtends];
  }

  if (await PackageManager.isInstalled('typescript')) {
    console.log(green('Update ESLint config file for TypeScript'));
    if (
      await PackageManager.isInstalled('eslint-config-standard-with-typescript')
    ) {
      console.log(yellow('Uninstall eslint-config-standard-with-typescript'));
      await framework.packageManager.uninstall([
        'eslint-config-standard-with-typescript',
      ]);
    }

    if (await PackageManager.isInstalled('@typescript-eslint/eslint-plugin')) {
      console.log(yellow('Uninstall @typescript-eslint/eslint-plugin'));
      await framework.packageManager.uninstall([
        '@typescript-eslint/eslint-plugin',
      ]);
    }

    if (!(await PackageManager.isInstalled('@vue/eslint-config-typescript'))) {
      console.log(green('Install @vue/eslint-config-typescript'));
      await framework.packageManager.install(
        ['@vue/eslint-config-typescript'],
        true
      );
    }

    let index = configExtends.indexOf('standard-with-typescript');
    if (index !== -1) {
      configExtends.splice(index, 1);
    }

    index = configExtends.indexOf('plugin:@typescript-eslint/recommended');
    if (index !== -1) {
      configExtends.splice(index, 1);
    }

    index = configExtends.indexOf('plugin:@typescript-eslint');
    if (index !== -1) {
      configExtends.splice(index, 1);
    }

    if (!configExtends.includes('@vue/eslint-config-typescript')) {
      configExtends.push('@vue/eslint-config-typescript');
    }
  }

  config.put('extends', configExtends);
  config.save();
}

const install = async (framework: Framework) => {
  console.log(green('ESLint install'));
  await createESLintConfig(framework);
  await updateConfigFile(framework);
  await addLintScript(framework, ['ts', 'js', 'json']);
  updateVSCodeSettingsForESLint();
  updateVSCodeExtensionsFileForESLint();
};

export const ESLint = new Tool.Builder()
  .setInstall(install)
  .setPromptChoice({
    title: Tools.ESLint,
  })
  .build();
