import {
  addFormatScript,
  initPrettierConfigFile,
  installPrettierDependencies,
  installPrettierDependenciesForESLint,
  updateESLintConfigFileForPrettier,
  updateVSCodeExtensionsFileForPrettier,
  updateVSCodeSettingsForPrettier,
} from '@/utils/prettier';
import { Framework } from '@/models/framework';
import { Tool } from '@/models/tool';
import { existESLintConfigFiles } from '@/utils/eslint';
import { ConfigParser } from 'config-parser-master';
import { green, yellow } from 'kolorist';
import { Tools } from '@/const/tools';

function updatePrettierConfigFile() {
  console.log(green('Update Prettier config file'));
  const configFile = initPrettierConfigFile();
  const config = ConfigParser.parse(configFile);
  const plugins = config.get('plugins', []) as Array<string>;
  if (!plugins.includes('prettier-plugin-svelte')) {
    plugins.push('prettier-plugin-svelte');
  }
  config.put('plugins', plugins);

  const overrides = config.get('overrides', []);
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

const install = async (framework: Framework) => {
  console.log(green('Prettier install'));

  console.log(green('Install Prettier and Prettier Svelte plugin'));
  await installPrettierDependencies(framework, ['prettier-plugin-svelte@^2']);
  if (existESLintConfigFiles()) {
    console.log(
      yellow('ESLint config file found, install ESLint Prettier plugin')
    );

    await installPrettierDependenciesForESLint(framework);
    updateESLintConfigFileForPrettier();
  }

  updatePrettierConfigFile();
  await addFormatScript(framework, ['ts', 'js', 'json', 'svelte']);

  updateVSCodeExtensionsFileForPrettier();
  updateVSCodeSettingsForPrettier();
};

export const Prettier = new Tool.Builder()
  .setInstall(install)
  .setPromptChoice({
    title: Tools.Prettier,
  })
  .build();
