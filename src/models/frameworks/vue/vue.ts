import { Framework } from '../framework';
import { PackageManager } from '../../package-manager/package-manager';
import { ESLint } from './tools/eslint';
import { Prettier } from './tools/prettier';
import { Husky } from './tools/husky';
import { LintStaged } from './tools/lintstaged';
import { Tailwind } from './tools/tailwind';

export class Vue extends Framework {
  constructor(packageManager: PackageManager) {
    const tools = [ESLint, Prettier, Husky, LintStaged, Tailwind];
    super(packageManager, tools);
  }
}
