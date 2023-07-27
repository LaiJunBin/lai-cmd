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

async function updateConfigFile(framework: Framework) {
  console.log(green('Update ESLint config file'));
  const configFile = getESLintConfigFileName();
  const config = ConfigParser.parse(configFile);
  let configExtends = config.get('extends', []);
  if (!Array.isArray(configExtends)) {
    configExtends = [configExtends];
  }

  const extendsValues = ['plugin:react-hooks/recommended'];
  const packages = ['eslint-plugin-react-hooks'];
  if (await PackageManager.isInstalled('typescript')) {
    extendsValues.push('plugin:@typescript-eslint/recommended');
    packages.push(
      '@typescript-eslint/eslint-plugin',
      '@typescript-eslint/parser'
    );
  } else {
    extendsValues.push('plugin:react/recommended', 'plugin:react/jsx-runtime');
    packages.push('eslint-plugin-react');
  }

  console.log(green('Install ESLint packages:'));
  console.log(packages.join(', '));

  await framework.packageManager.install(packages, true);
  for (const value of extendsValues) {
    if (!configExtends.includes(value)) {
      configExtends.push(value);
    }
  }
  config.put('extends', configExtends);

  if (await PackageManager.isInstalled('typescript')) {
    console.log(green('set parser to @typescript-eslint/parser'));
    config.put('parser', '@typescript-eslint/parser');
  }

  config.save();
}

const install = async (framework: Framework) => {
  console.log(green('ESLint install'));
  await createESLintConfig(framework);
  await updateConfigFile(framework);
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
