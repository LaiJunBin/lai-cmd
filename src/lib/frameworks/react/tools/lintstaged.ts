import { existLintStagedConfigFiles } from '@/utils/lintstaged';
import { Framework } from '@/models/framework';
import { Tool } from '@/models/tool';
import { Tools } from '@/const/tools';

const install = async (framework: Framework) => {
  console.log('lintstage install');
};

export const LintStaged = new Tool.Builder()
  .setInstall(install)
  .setPromptChoice({
    title: Tools.LintStaged,
    disabled: existLintStagedConfigFiles(),
  })
  .build();
