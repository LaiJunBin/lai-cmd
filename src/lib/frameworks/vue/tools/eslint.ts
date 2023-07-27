import { Tools } from '@/const/tools';
import { Framework } from '@/models/framework';
import { Tool } from '@/models/tool';
import { existESLintConfigFiles } from '@/utils/eslint';

const install = async (framework: Framework) => {
  console.log('eslint install');
};

export const ESLint = new Tool.Builder()
  .setInstall(install)
  .setPromptChoice({
    title: Tools.ESLint,
    disabled: existESLintConfigFiles(),
  })
  .build();
