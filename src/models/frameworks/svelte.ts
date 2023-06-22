import { Framework } from './framework';
import { ESLintIntstallable } from '../interfaces/eslint-installable';
import { HuskyInstallable } from '../interfaces/husky-installabe';
import { LintStagedInstallable } from '../interfaces/lint-staged-installable';
import { PrettierInstallable } from '../interfaces/prettier-installable';
import { TailwindInstallable } from '../interfaces/tailwind-installable';
import { PackageManager } from '../pacakge-manager';
import fs from 'fs';
import { pushExtendsToESLintConfigFiles } from '../../utils/push-extends-to-eslint-config-files';
import { existPrettierConfigFiles } from '../../utils/exist-prettier-config-files';

export class Svelte
  extends Framework
  implements
    ESLintIntstallable,
    PrettierInstallable,
    HuskyInstallable,
    LintStagedInstallable,
    TailwindInstallable
{
  constructor(packageManager: PackageManager) {
    super(packageManager);
  }

  async installESLint(): Promise<void> {
    await this.packageManager.create('@eslint/config');

    const configExtensionType = ['.js', '.cjs', '.yml', '.json'].find((type) =>
      fs.existsSync(`.eslintrc${type}`)
    ) as '.js' | '.cjs' | '.yml' | '.json';

    // parse .eslintrc.{js,cjs,yml,json} and add plugin:svelte/recommended to extends
    await pushExtendsToESLintConfigFiles(
      configExtensionType,
      'plugin:svelte/recommended'
    );

    if (
      this.toolsToBeInstalled.includes('prettier') ||
      existPrettierConfigFiles()
    ) {
      // parse .eslintrc.{js,cjs,yml,json} and add 'prettier' to extends
      await pushExtendsToESLintConfigFiles(configExtensionType, 'prettier');
    }

    await this.packageManager.addScript(
      'lint',
      'prettier --plugin-search-dir . --check . && eslint .'
    );
  }

  async installPrettier(): Promise<void> {
    // throw new Error("Method not implemented.");
    return this.packageManager.install(['prettier']);
  }

  async installHusky(): Promise<void> {
    // throw new Error("Method not implemented.");
    return this.packageManager.install(['husky']);
  }

  async installLintStaged(): Promise<void> {
    // throw new Error("Method not implemented.");
    return this.packageManager.install(['lint-staged']);
  }

  async installTailwind(): Promise<void> {
    // throw new Error("Method not implemented.");
    return this.packageManager.install(['tailwindcss']);
  }
}
