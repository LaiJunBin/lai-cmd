import prompts from 'prompts';
import { PackageManager } from '../pacakge-manager';
import { isESLintInstallable } from '../interfaces/eslint-installable';
import { isPrettierInstallable } from '../interfaces/prettier-installable';
import { isHuskyInstallable } from '../interfaces/husky-installabe';
import { isLintStagedInstallable } from '../interfaces/lint-staged-installable';
import { isTailwindInstallable } from '../interfaces/tailwind-installable';
import { existESLintConfigFiles } from '../../utils/exist-eslint-config-files';
import { existPrettierConfigFiles } from '../../utils/exist-prettier-config-files';
import { existHuskyConfigFiles } from '../../utils/exist-husky-config-files';
import { existLintStagedConfigFiles } from '../../utils/exist-lintstage-config-files';
import { existTailwindConfigFiles } from '../../utils/exist-tailwind-config-files';

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
      choices: (isESLintInstallable(this)
        ? [
            {
              title: 'ESLint',
              value: 'eslint',
              disabled: existESLintConfigFiles(),
            },
          ]
        : []
      )
        .concat(
          isPrettierInstallable(this)
            ? [
                {
                  title: 'Prettier',
                  value: 'prettier',
                  disabled: existPrettierConfigFiles(),
                },
              ]
            : []
        )
        .concat(
          isHuskyInstallable(this)
            ? [
                {
                  title: 'Husky',
                  value: 'husky',
                  disabled: existHuskyConfigFiles(),
                },
              ]
            : []
        )
        .concat(
          isLintStagedInstallable(this)
            ? [
                {
                  title: 'Lint Staged',
                  value: 'lint-staged',
                  disabled: existLintStagedConfigFiles(),
                },
              ]
            : []
        )
        .concat(
          isTailwindInstallable(this)
            ? [
                {
                  title: 'Tailwind',
                  value: 'tailwind',
                  disabled: existTailwindConfigFiles(),
                },
              ]
            : []
        ),
    });

    if (isESLintInstallable(this) && toolsToBeInstalled.includes('eslint')) {
      await this.installESLint();
    }

    if (
      isPrettierInstallable(this) &&
      toolsToBeInstalled.includes('prettier')
    ) {
      await this.installPrettier();
    }

    if (isHuskyInstallable(this) && toolsToBeInstalled.includes('husky')) {
      await this.installHusky();
    }

    if (
      isLintStagedInstallable(this) &&
      toolsToBeInstalled.includes('lint-staged')
    ) {
      await this.installLintStaged();
    }

    if (
      isTailwindInstallable(this) &&
      toolsToBeInstalled.includes('tailwind')
    ) {
      await this.installTailwind();
    }
  }
}
