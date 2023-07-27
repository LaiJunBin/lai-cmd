import { Framework } from '@/models/framework';
import { ConfigParser } from 'config-parser-master';
import fs from 'fs';
import { green, yellow } from 'kolorist';
import {
  addVSCodeExtensionsToRecommendations,
  putVSCodeSettings,
} from './vscode';
import { Tools } from '@/const/tools';
import { existPrettierConfigFiles } from './prettier';
import { existTailwindConfigFiles } from './tailwind';

export function existStyleLintConfigFiles(): boolean {
  return fs.readdirSync('.').some((fileName) => {
    return fileName.startsWith('.stylelintrc');
  });
}

export function getStyleLintConfigFileName(): string | null {
  const extension = ['.js', '.cjs', '.yml', '.json', ''].find((type) =>
    fs.existsSync(`.stylelintrc${type}`)
  );

  if (extension === undefined) {
    return null;
  }

  return `.stylelintrc${extension}`;
}

export async function installStyleLintDependencies(framework: Framework) {
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

function updateCommonStyleLintConfig() {
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

export async function updateStyleLintConfigFile(framework: Framework) {
  updateCommonStyleLintConfig();
  if (
    framework.checkToBeInstalled(Tools.Prettier) ||
    existPrettierConfigFiles()
  ) {
    console.log(yellow('Prettier config file found, install Prettier plugin'));
    await installStyleLintPrettierPlugin(framework);
    updateStyleLintConfigForPrettier();
  }

  if (
    framework.checkToBeInstalled(Tools.Tailwind) ||
    existTailwindConfigFiles()
  ) {
    console.log(
      yellow('TailwindCSS config file found, update stylelint config')
    );
    updateStyleLintConfigFileForTailwind();
  }
}

export async function installStyleLintPrettierPlugin(framework: Framework) {
  console.log(green('Install StyleLint Prettier plugin'));

  await framework.packageManager.install(['stylelint-prettier@^3'], true);
}

export function updateStyleLintConfigForPrettier() {
  console.log(green('Update StyleLint config file for Prettier'));
  const configFile = getStyleLintConfigFileName();
  const config = ConfigParser.parse(configFile);
  const extendsValues = config.get('extends', []) as Array<string>;
  if (!extendsValues.includes('stylelint-prettier/recommended')) {
    const index = extendsValues.indexOf('stylelint-config-recess-order');
    extendsValues.splice(index, 0, 'stylelint-prettier/recommended');
  }

  config.put('extends', extendsValues);
  config.save();
}

export function updateStyleLintConfigFileForTailwind() {
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

export async function addStyleLintScript(framework: Framework) {
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

export function updateVSCodeExtensionsFileForStyleLint() {
  console.log(green('Update VSCode extensions file'));
  const extensions = ['stylelint.vscode-stylelint', 'csstools.postcss'];
  addVSCodeExtensionsToRecommendations(extensions);
}

export function updateVSCodeSettingsForStyleLint() {
  console.log(green('Update VSCode settings file'));
  const settings = {
    '"editor.codeActionsOnSave"': {
      'source.fixAll.stylelint': true,
    },
  };
  putVSCodeSettings(settings);
}
