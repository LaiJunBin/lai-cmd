import { Framework } from './framework';
import { ESLintIntstallable } from '../interfaces/eslint-installable';
import { HuskyInstallable } from '../interfaces/husky-installabe';
import { LintStagedInstallable } from '../interfaces/lint-staged-installable';
import { PrettierInstallable } from '../interfaces/prettier-installable';
import { TailwindInstallable } from '../interfaces/tailwind-installable';

export class Others
  extends Framework
  implements
    ESLintIntstallable,
    PrettierInstallable,
    HuskyInstallable,
    LintStagedInstallable,
    TailwindInstallable
{
  async installESLint(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async installPrettier(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async installHusky(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async installLintStaged(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async installTailwind(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
