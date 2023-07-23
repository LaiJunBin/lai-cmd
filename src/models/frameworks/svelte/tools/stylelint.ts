import { existPrettierConfigFiles } from '../../../../utils/prettier';
import { Framework } from '../../framework';
import { Tool } from '../../../tool';

import { ConfigParser } from 'config-parser-master';
import fs from 'fs';
import {
  addVSCodeExtensionsToRecommendations,
  getVSCodeSettingsFileName,
} from '../../../../utils/vscode';
import { green, yellow } from 'kolorist';
import { getStyleLintConfigFileName } from '../../../../utils/stylelint';
import { existTailwindConfigFiles } from '../../../../utils/tailwind';

async function installDependencies(framework: Framework) {
  console.log(green('Install StyleLint and StyleLint plugins'));
  const installedPackages = [
    'stylelint',
    'stylelint-config-recess-order',
    'stylelint-config-standard',
  ];

  console.log(green('Install dependencies:'));
  console.log(installedPackages.join(', '));

  await framework.packageManager.install(installedPackages, true);
}

async function installPrettierPlugin(framework: Framework) {
  console.log(green('Install StyleLint Prettier plugin'));

  await framework.packageManager.install(
    ['stylelint-config-prettier', 'stylelint-prettier@^3'],
    true
  );
}

function updateStyleLintConfigFile() {
  console.log(green('Update StyleLint config file'));
  let configFile = getStyleLintConfigFileName();
  if (!configFile) {
    console.log(yellow('StyleLint config file not found, create .stylelintrc'));
    configFile = '.stylelintrc';
    fs.writeFileSync(configFile, `{}`);
  }

  const config = ConfigParser.parse(configFile);
  const extendsValues = config.get('extends', []) as Array<string>;
  const assignExtendsValues = [
    'stylelint-config-standard',
    'stylelint-config-recess-order',
  ];
  assignExtendsValues.forEach((value) => {
    if (!extendsValues.includes(value)) {
      extendsValues.push(value);
    }
  });
  config.put('extends', extendsValues);
  config.save();
}

function updateStyleLintConfigForPrettier() {
  console.log(green('Update StyleLint config file for Prettier'));
  const configFile = getStyleLintConfigFileName();
  const config = ConfigParser.parse(configFile);
  const extendsValues = config.get('extends', []) as Array<string>;
  if (!extendsValues.includes('stylelint-prettier/recommended')) {
    const index = extendsValues.indexOf('stylelint-config-recess-order');
    extendsValues.splice(index, 0, 'stylelint-prettier/recommended');
  }
  if (!extendsValues.includes('stylelint-config-prettier')) {
    extendsValues.push('stylelint-config-prettier');
  }
  config.put('extends', extendsValues);
  config.save();
}

function updateStyleLintConfigFileForTailwind() {
  console.log(green('Update StyleLint config file for TailwindCSS'));
  const configFile = getStyleLintConfigFileName();
  const config = ConfigParser.parse(configFile);
  config.put('rules', {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind'],
      },
    ],
  });
  config.save();
}

async function addScript(framework: Framework) {
  console.log(green('Add stylelint script'));
  if (await framework.packageManager.hasScript('stylelint')) {
    console.log(yellow('stylelint script already exists, skip'));
    return;
  }
  await framework.packageManager.addScript(
    'stylelint',
    'stylelint src/**/*.{css,scss} --fix'
  );
}

function updateVSCodeExtensionsFile() {
  console.log(green('Update VSCode extensions file'));
  const extensions = ['stylelint.vscode-stylelint', 'csstools.postcss'];
  addVSCodeExtensionsToRecommendations(extensions);
}

function updateVSCodeSettings() {
  console.log(green('Update VSCode settings file'));
  const settings = {
    'editor.codeActionsOnSave': {
      'source.fixAll.stylelint': true,
    },
  };
  const vscodeSettingsFile = getVSCodeSettingsFileName();
  const config = ConfigParser.parse(vscodeSettingsFile);
  config.put(
    '"editor.codeActionsOnSave"',
    settings['editor.codeActionsOnSave']
  );
  config.save();
}

const install = async (framework: Framework) => {
  console.log(green('StyleLint install'));
  await installDependencies(framework);
  updateStyleLintConfigFile();

  if (existPrettierConfigFiles()) {
    console.log(yellow('Prettier config file found, install Prettier plugin'));
    await installPrettierPlugin(framework);
    updateStyleLintConfigForPrettier();
  }
  if (existTailwindConfigFiles()) {
    console.log(
      yellow('TailwindCSS config file found, update stylelint config')
    );
    updateStyleLintConfigFileForTailwind();
  }
  await addScript(framework);
  updateVSCodeExtensionsFile();
  updateVSCodeSettings();
};

export const StyleLint = new Tool.Builder()
  .setInstall(install)
  .setPromptChoice({
    title: 'StyleLint',
  })
  .build();
