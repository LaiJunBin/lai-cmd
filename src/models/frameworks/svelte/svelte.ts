import { Framework } from '../framework';
import { PackageManager } from '../../package-manager/package-manager';
import { ESLint } from './tools/eslint';
import { Prettier } from './tools/prettier';
import { Husky } from './tools/husky';
import { LintStaged } from './tools/lintstaged';
import { Tailwind } from './tools/tailwind';
import { TestingLibrary } from './tools/testing-library/testing-library';
import { MSW } from './tools/msw/msw';

export class Svelte extends Framework {
  constructor(packageManager: PackageManager) {
    const tools = [
      ESLint,
      Prettier,
      Husky,
      LintStaged,
      Tailwind,
      TestingLibrary,
      MSW,
    ];
    super(packageManager, tools);
  }

  static async check(): Promise<boolean> {
    return (
      (await PackageManager.isInstalled('svelte')) &&
      !(await PackageManager.isInstalled('@sveltejs/kit'))
    );
  }
}
