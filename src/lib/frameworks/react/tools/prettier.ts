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
import { green, yellow } from 'kolorist';
import { Tools } from '@/const/tools';

const install = async (framework: Framework) => {
  console.log(green('Prettier install'));

  await installPrettierDependencies(framework, []);
  initPrettierConfigFile();
  if (existESLintConfigFiles()) {
    console.log(
      yellow('ESLint config file found, install ESLint Prettier plugin')
    );

    await installPrettierDependenciesForESLint(framework);
    updateESLintConfigFileForPrettier();
  }

  await addFormatScript(framework, ['ts', 'js', 'tsx', 'jsx', 'json']);

  updateVSCodeExtensionsFileForPrettier();
  updateVSCodeSettingsForPrettier();
};

export const Prettier = new Tool.Builder()
  .setInstall(install)
  .setPromptChoice({
    title: Tools.Prettier,
  })
  .build();
