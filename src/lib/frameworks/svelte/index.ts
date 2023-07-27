import { Framework } from '@/models/framework';
import { PackageManager } from '@/models/package-manager';
import { ESLint } from './tools/eslint';
import { Prettier } from './tools/prettier';
import { TestingLibrary } from './tools/testing-library/testing-library';
import { MSW } from './tools/msw/msw';
import { createStyleLintTool } from '@/lib/common-tools/stylelint';
import { createHuskyTool } from '@/lib/common-tools/husky';
import { createLintStagedTool } from '@/lib/common-tools/lintstaged';
import { createTailwindTool } from '@/lib/common-tools/tailwind';

export class Svelte extends Framework {
  constructor(packageManager: PackageManager) {
    const StyleLint = createStyleLintTool();
    const Husky = createHuskyTool();
    const LintStaged = createLintStagedTool();
    const Tailwind = createTailwindTool('./src/app.css');

    const tools = [
      ESLint,
      Prettier,
      StyleLint,
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
