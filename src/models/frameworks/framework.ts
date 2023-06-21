import prompts from 'prompts';
import { PackageManager } from '../pacakge-manager';
import { isESLintInstallable } from '../interfaces/eslint-installable';
import { isPrettierInstallable } from '../interfaces/prettier-installable';
import { isHuskyInstallable } from '../interfaces/husky-installabe';
import { isLintStagedInstallable } from '../interfaces/lint-staged-installable';
import { isTailwindInstallable } from '../interfaces/tailwind-installable';

export class Framework {
  protected packageManager: PackageManager;

  constructor(packageManager: PackageManager) {
    this.packageManager = packageManager;
  }

  async install(): Promise<void> {
    const {
      toolsToBeInstalled,
    }: {
      toolsToBeInstalled: (
        | 'eslint'
        | 'prettier'
        | 'husky'
        | 'lint-staged'
        | 'tailwind'
      )[];
    } = await prompts({
      type: 'multiselect',
      name: 'toolsToBeInstalled',
      message: 'Which tools do you want to install?',
      choices: [
        { title: 'ESLint', value: 'eslint' },
        { title: 'Prettier', value: 'prettier' },
        { title: 'Husky', value: 'husky' },
        { title: 'Lint Staged', value: 'lint-staged' },
        { title: 'Tailwind', value: 'tailwind' },
      ],
    });

    if (isESLintInstallable(this)) {
      if (toolsToBeInstalled.includes('eslint')) {
        await this.installESLint();
      }
    }

    if (isPrettierInstallable(this)) {
      if (toolsToBeInstalled.includes('prettier')) {
        await this.installPrettier();
      }
    }

    if (isHuskyInstallable(this)) {
      if (toolsToBeInstalled.includes('husky')) {
        await this.installHusky();
      }
    }

    if (isLintStagedInstallable(this)) {
      if (toolsToBeInstalled.includes('lint-staged')) {
        await this.installLintStaged();
      }
    }

    if (isTailwindInstallable(this)) {
      if (toolsToBeInstalled.includes('tailwind')) {
        await this.installTailwind();
      }
    }
  }
}
