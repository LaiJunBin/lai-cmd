import { Framework } from './framework';
import { ESLintIntstallable } from '../interfaces/eslint-installable';
import { HuskyInstallable } from '../interfaces/husky-installabe';
import { LintStagedInstallable } from '../interfaces/lint-staged-installable';
import { PrettierInstallable } from '../interfaces/prettier-installable';
import { TailwindInstallable } from '../interfaces/tailwind-installable';

export class Vue
  extends Framework
  implements
    ESLintIntstallable,
    PrettierInstallable,
    HuskyInstallable,
    LintStagedInstallable,
    TailwindInstallable
{
  installESLint(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  installPrettier(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  installHusky(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  installLintStaged(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  installTailwind(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
