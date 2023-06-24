import { existPrettierConfigFiles } from '../../../../../utils/exist-prettier-config-files';
import { pushExtendsToESLintConfigFiles } from '../../../../../utils/push-extends-to-eslint-config-files';
import { Framework } from '../../../framework';
import { Tool } from '../../../../tool';
import fs from 'fs';
import { Prettier } from '../prettier';
import { existESLintConfigFiles } from '../../../../../utils/exist-eslint-config-files';
import { ChangeSvelte3ToSvelte } from './change-svelte3-to-svelte';

const install = async (framework: Framework) => {
  await framework.packageManager.create('@eslint/config');

  const configExtensionType = ['.js', '.cjs', '.yml', '.json'].find((type) =>
    fs.existsSync(`.eslintrc${type}`)
  ) as '.js' | '.cjs' | '.yml' | '.json';

  // parse .eslintrc.{js,cjs,yml,json} and add plugin:svelte/recommended to extends
  await pushExtendsToESLintConfigFiles(
    configExtensionType,
    'plugin:svelte/recommended'
  );

  if (
    framework.toolsToBeInstalled.includes(Prettier) ||
    existPrettierConfigFiles()
  ) {
    // parse .eslintrc.{js,cjs,yml,json} and add 'prettier' to extends
    await pushExtendsToESLintConfigFiles(configExtensionType, 'prettier');
  }

  await framework.packageManager.addScript(
    'lint',
    'prettier --plugin-search-dir . --check . && eslint .'
  );
};

export const ESLint = new Tool.Builder()
  .setInstall(install)
  .setPromptChoice({
    title: 'ESLint',
    disabled: existESLintConfigFiles(),
  })
  .setChildren([ChangeSvelte3ToSvelte])
  .build();
