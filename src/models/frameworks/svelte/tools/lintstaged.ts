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

const install = async (framework: Framework) => {
  console.log('lintstage install');
  const commands = [];

  if (
    framework.toolsToBeInstalled.includes(ESLint) ||
    existESLintConfigFiles()
  ) {
    commands.push('eslint --fix');
  }

  if (commands.length === 0) {
    console.log(yellow('No commands to be executed, skip lintstage install'));
    return;
  }

  if (
    framework.toolsToBeInstalled.includes(Prettier) ||
    existPrettierConfigFiles()
  ) {
    commands.push('prettier --write');
  }

  console.log(green('install dependencies'));
  await framework.packageManager.install(['lint-staged'], true);

  console.log(green('add lint-staged config'));
  const configFile = '.lintstagedrc';
  fs.writeFileSync(configFile, '{}');
  const config = ConfigParser.parse(configFile);
  config.put('"src/**/*.{ts,js,json,md}"', commands);
  config.save();
};

export const LintStaged = new Tool.Builder()
  .setInstall(install)
  .setPromptChoice({
    title: 'Lint Staged',
    disabled: existLintStagedConfigFiles(),
  })
  .build();
