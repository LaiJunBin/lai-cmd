import {
  addFormatScript,
  installPrettierDependencies,
  installPrettierDependenciesForESLint,
  updateESLintConfigFileForPrettier,
  updateVSCodeExtensionsFileForPrettier,
  updateVSCodeSettingsForPrettier,
} from '@/utils/prettier';
import { Framework } from '@/models/framework';
import { Tool } from '@/models/tool';
import {
  existESLintConfigFiles,
  getESLintConfigFileName,
} from '@/utils/eslint';
import { ConfigParser } from 'config-parser-master';
import { green, yellow } from 'kolorist';
import { Tools } from '@/const/tools';

function removePrettierSkipFormattingConfig() {
  console.log(green('remove prettier skip-formatting config'));
  const configFile = getESLintConfigFileName();
  const config = ConfigParser.parse(configFile);
  const extendsValue = config.get('extends', []);

  if (extendsValue.includes('@vue/eslint-config-prettier/skip-formatting')) {
    extendsValue.splice(
      extendsValue.indexOf('@vue/eslint-config-prettier/skip-formatting'),
      1,
      ...['@vue/eslint-config-prettier']
    );
    config.put('extends', extendsValue);
    config.save();
  }
}

function resolvePrettierPluginConflict() {
  console.log(green('resolve prettier plugin conflict'));
  const configFile = getESLintConfigFileName();
  const config = ConfigParser.parse(configFile);
  const pluginsValue = config.get('plugins', []);

  if (pluginsValue.includes('prettier')) {
    pluginsValue.splice(pluginsValue.indexOf('prettier'), 1);
    config.put('plugins', pluginsValue);
    config.save();
  }
}

const install = async (framework: Framework) => {
  console.log(green('Prettier install'));

  console.log(green('Install Prettier and Prettier vue plugin'));
  await installPrettierDependencies(framework, [
    '@vue/eslint-config-prettier@^7',
  ]);
  if (existESLintConfigFiles()) {
    console.log(
      yellow('ESLint config file found, install ESLint Prettier plugin')
    );

    await installPrettierDependenciesForESLint(framework);
    updateESLintConfigFileForPrettier();
    removePrettierSkipFormattingConfig();
    resolvePrettierPluginConflict();
  }

  await addFormatScript(framework, ['ts', 'js', 'json']);

  updateVSCodeExtensionsFileForPrettier();
  updateVSCodeSettingsForPrettier();
};

export const Prettier = new Tool.Builder()
  .setInstall(install)
  .setPromptChoice({
    title: Tools.Prettier,
  })
  .build();
