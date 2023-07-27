import { Framework } from '@/models/framework';
import { ConfigParser } from 'config-parser-master';
import fs from 'fs';
import { green, yellow } from 'kolorist';
import { existESLintConfigFiles } from './eslint';
import { existPrettierConfigFiles } from './prettier';
import { existStyleLintConfigFiles } from './stylelint';
import { Tools } from '@/const/tools';

export function existLintStagedConfigFiles(): boolean {
  return (
    fs.existsSync('.lintstagedrc') ||
    (fs.existsSync('package.json') &&
      JSON.parse(fs.readFileSync('package.json', 'utf-8')).hasOwnProperty(
        'lint-staged'
      ))
  );
}

export async function installLintStaged(framework: Framework) {
  const configFile = '.lintstagedrc';
  console.log(green('create lint-staged config'));
  fs.writeFileSync(configFile, '{}');

  console.log(green('check commands to be executed'));
  const config = ConfigParser.parse(configFile);
  const commands = [];

  if (framework.checkToBeInstalled(Tools.ESLint) || existESLintConfigFiles()) {
    commands.push('eslint --fix');
  }

  if (
    framework.checkToBeInstalled(Tools.Prettier) ||
    existPrettierConfigFiles()
  ) {
    commands.push('prettier --write');
    config.put('".*rc"', ['prettier --write --ignore-unknown']);
    config.put('"*.{html,md}"', ['prettier --write']);
  }

  if (commands.length) {
    config.put('"*.{ts,js,cjs,json,svelte}"', commands);
  }

  if (
    framework.checkToBeInstalled(Tools.StyleLint) ||
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
}
