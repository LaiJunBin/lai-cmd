import { createStyleLintTool } from '@/lib/common-tools/stylelint';
import { Framework } from '@/models/framework';
import { PackageManager } from '@/models/package-manager';
import { ESLint } from './tools/eslint';
import { MSW } from './tools/msw/msw';
import { Prettier } from './tools/prettier';
import { TestingLibrary } from './tools/testing-library/testing-library';
import { createHuskyTool } from '@/lib/common-tools/husky';
import { createLintStagedTool } from '@/lib/common-tools/lintstaged';
import { createTailwindTool } from '@/lib/common-tools/tailwind';
import { createZodTool } from '@/lib/common-tools/zod';
import { createAxiosTool } from '@/lib/common-tools/axios';

export class SvelteKit extends Framework {
  constructor(packageManager: PackageManager) {
    const StyleLint = createStyleLintTool();
    const Husky = createHuskyTool();
    const LintStaged = createLintStagedTool();
    const Tailwind = createTailwindTool('./src/index.css');
    const Zod = createZodTool();
    const Axios = createAxiosTool();

    const tools = [
      ESLint,
      Prettier,
      StyleLint,
      Husky,
      LintStaged,
      Tailwind,
      TestingLibrary,
      MSW,
      Zod,
      Axios,
    ];
    super(packageManager, tools);
  }

  static async check(): Promise<boolean> {
    return await PackageManager.isInstalled('@sveltejs/kit');
  }
}
