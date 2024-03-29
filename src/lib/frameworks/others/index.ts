import { Framework } from '@/models/framework';
import { PackageManager } from '@/models/package-manager';
import { ESLint } from './tools/eslint';
import { Prettier } from './tools/prettier';
import { createStyleLintTool } from '@/lib/common-tools/stylelint';
import { createHuskyTool } from '@/lib/common-tools/husky';
import { createLintStagedTool } from '@/lib/common-tools/lintstaged';
import { createTailwindTool } from '@/lib/common-tools/tailwind';
import { MSW } from './tools/msw/msw';
import { getDevLanguage } from '@/utils';
import { createZodTool } from '@/lib/common-tools/zod';
import { createAxiosTool } from '@/lib/common-tools/axios';

export class Others extends Framework {
  constructor(packageManager: PackageManager) {
    const StyleLint = createStyleLintTool();
    const Husky = createHuskyTool();
    const LintStaged = createLintStagedTool();
    const cssPath =
      getDevLanguage() === 'ts' ? './src/style.css' : './style.css';
    const Tailwind = createTailwindTool(cssPath);
    const Zod = createZodTool();
    const Axios = createAxiosTool();

    const tools = [
      ESLint,
      Prettier,
      StyleLint,
      Husky,
      LintStaged,
      Tailwind,
      MSW,
      Zod,
      Axios,
    ];
    super(packageManager, tools);
  }
}
