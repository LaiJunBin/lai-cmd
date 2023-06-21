import { Framework } from './framework';
import { ESLintIntstallable } from '../interfaces/eslint-installable';
import { HuskyInstallable } from '../interfaces/husky-installabe';
import { LintStagedInstallable } from '../interfaces/lint-staged-installable';
import { PrettierInstallable } from '../interfaces/prettier-installable';
import { TailwindInstallable } from '../interfaces/tailwind-installable';
import { PackageManager } from '../pacakge-manager';

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

  installESLint(): Promise<void> {
    // throw new Error("Method not implemented.");
    return this.packageManager.install(['eslint']);
  }

  installPrettier(): Promise<void> {
    // throw new Error("Method not implemented.");
    return this.packageManager.install(['prettier']);
  }

  installHusky(): Promise<void> {
    // throw new Error("Method not implemented.");
    return this.packageManager.install(['husky']);
  }

  installLintStaged(): Promise<void> {
    // throw new Error("Method not implemented.");
    return this.packageManager.install(['lint-staged']);
  }

  installTailwind(): Promise<void> {
    // throw new Error("Method not implemented.");
    return this.packageManager.install(['tailwindcss']);
  }
}
