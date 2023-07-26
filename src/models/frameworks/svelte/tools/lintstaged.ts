import { existLintStagedConfigFiles } from '../../../../utils/exist-lintstage-config-files';
import { Framework } from '../../framework';
import { Tool } from '../../../tool';
import { Prettier } from './prettier';
import { existPrettierConfigFiles } from '../../../../utils/prettier';
import { ESLint } from './eslint';
import { existESLintConfigFiles } from '../../../../utils/eslint';
import { green, yellow } from 'kolorist';
import fs from 'fs';
import { ConfigParser } from 'config-parser-master';
import { StyleLint } from './stylelint';
import { existStyleLintConfigFiles } from '../../../../utils/stylelint';

const install = async (framework: Framework) => {
  console.log(green('lintstage install'));

  const configFile = '.lintstagedrc';
  console.log(green('create lint-staged config'));
  fs.writeFileSync(configFile, '{}');

  console.log(green('check commands to be executed'));
  const config = ConfigParser.parse(configFile);
  const commands = [];

  if (
    framework.toolsToBeInstalled.includes(ESLint) ||
    existESLintConfigFiles()
  ) {
    commands.push('eslint --fix');
  }

  if (
    framework.toolsToBeInstalled.includes(Prettier) ||
    existPrettierConfigFiles()
  ) {
    commands.push('prettier --write');
    config.put('".*rc"', ['prettier --write']);
    config.put('"*.{html,md}"', ['prettier --write']);
  }

  if (commands.length) {
    config.put('"*.{ts,js,cjs,json,svelte}"', commands);
  }

  if (
    framework.toolsToBeInstalled.includes(StyleLint) ||
    existStyleLintConfigFiles()
  ) {
    config.put('"src/**/*.{css,scss}"', ['stylelint --fix']);
  }

  if (config.content === '{}') {
    console.log(yellow('No commands to be executed, skip lintstage install'));
    console.log(yellow('Remove empty lint-staged config file'));
    fs.unlinkSync(configFile);
    return;
  }

  console.log(green('install dependencies'));
  await framework.packageManager.install(['lint-staged'], true);

  console.log(green('save commands to lint-staged config'));
  config.save();
};

export const LintStaged = new Tool.Builder()
  .setInstall(install)
  .setPromptChoice({
    title: 'Lint Staged',
    disabled: existLintStagedConfigFiles(),
  })
  .build();
