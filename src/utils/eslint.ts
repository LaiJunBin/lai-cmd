import { Framework } from '@/models/framework';
import fs from 'fs';
import { green, yellow } from 'kolorist';
import {
  addVSCodeExtensionsToRecommendations,
  putVSCodeSettings,
} from './vscode';

export function existESLintConfigFiles(): boolean {
  return fs.readdirSync('.').some((fileName) => {
    return fileName.startsWith('.eslintrc');
  });
}

export function getESLintConfigFileName(): string | null {
  const extension = ['.js', '.cjs', '.yml', '.json'].find((type) =>
    fs.existsSync(`.eslintrc${type}`)
  );

  if (!extension) {
    return null;
  }

  return `.eslintrc${extension}`;
}

export async function createESLintConfig(framework: Framework) {
  console.log(green('Create ESLint config file'));
  if (existESLintConfigFiles()) {
    console.log(yellow('ESLint config file already exists, skip creating'));
    return;
  }

  await framework.packageManager.create('@eslint/config');
}

export async function addLintScript(
  framework: Framework,
  extensions: string[]
) {
  console.log(green('Add lint script'));
  if (await framework.packageManager.hasScript('lint')) {
    console.log(yellow('Lint script already exists, skip adding'));
    return;
  }

  const extension = extensions.join(',');
  await framework.packageManager.addScript(
    'lint',
    `eslint --fix src/**/*.{${extension}}`
  );
}

export function updateVSCodeSettingsForESLint(options = {}) {
  console.log(green('Update VSCode settings'));
  const settings = {
    '"editor.codeActionsOnSave"': {
      'source.fixAll.eslint': true,
    },
    ...options,
  };
  putVSCodeSettings(settings);
}

export function updateVSCodeExtensionsFileForESLint() {
  console.log(green('Update VSCode extensions file'));
  const extensions = ['dbaeumer.vscode-eslint'];
  addVSCodeExtensionsToRecommendations(extensions);
}
