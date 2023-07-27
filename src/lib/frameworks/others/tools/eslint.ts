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
import { green } from 'kolorist';
import { Tools } from '@/const/tools';
import { PackageManager } from '@/lib/package-manager';

async function updateConfigFileForTypescript(framework: Framework) {
  console.log(green('Update ESLint config file for typescript'));
  const configFile = getESLintConfigFileName();
  const config = ConfigParser.parse(configFile);
  let configExtends = config.get('extends', []);
  if (!Array.isArray(configExtends)) {
    configExtends = [configExtends];
  }

  const packages = [
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint/parser',
  ];

  console.log(green('Install ESLint packages:'));
  console.log(packages.join(', '));
  await framework.packageManager.install(packages, true);

  if (!configExtends.includes('plugin:@typescript-eslint/recommended')) {
    configExtends.push('plugin:@typescript-eslint/recommended');
  }
  config.put('extends', configExtends);
  console.log(green('set parser to @typescript-eslint/parser'));
  config.put('parser', '@typescript-eslint/parser');

  config.save();
}

const install = async (framework: Framework) => {
  console.log(green('ESLint install'));
  await createESLintConfig(framework);
  if (await PackageManager.isInstalled('typescript')) {
    await updateConfigFileForTypescript(framework);
  }
  await addLintScript(framework, ['ts', 'js', 'tsx', 'jsx', 'json']);
  updateVSCodeSettingsForESLint();
  updateVSCodeExtensionsFileForESLint();
};

export const ESLint = new Tool.Builder()
  .setInstall(install)
  .setPromptChoice({
    title: Tools.ESLint,
  })
  .build();
