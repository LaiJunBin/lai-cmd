import { Framework } from '../framework';
import { PackageManager } from '../../package-manager/package-manager';
import { ESLint } from './tools/eslint/eslint';
import { Prettier } from './tools/prettier';
import { Husky } from './tools/husky';
import { LintStaged } from './tools/lintstaged';
import { Tailwind } from './tools/tailwind';

export class Svelte extends Framework {
  constructor(packageManager: PackageManager) {
    const tools = [ESLint, Prettier, Husky, LintStaged, Tailwind];
    super(packageManager, tools);
  }

  static async check(): Promise<boolean> {
    return await PackageManager.isInstalled('svelte');
  }
}
