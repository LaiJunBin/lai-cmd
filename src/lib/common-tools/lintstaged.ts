import {
  existLintStagedConfigFiles,
  installLintStaged,
} from '@/utils/lintstaged';
import { Framework } from '@/models/framework';
import { Tool } from '@/models/tool';
import { green } from 'kolorist';
import { Tools } from '@/const/tools';

export const createLintStagedTool = () => {
  const install = async (framework: Framework) => {
    console.log(green('lintstage install'));
    await installLintStaged(framework);
  };

  return new Tool.Builder()
    .setInstall(install)
    .setPromptChoice({
      title: Tools.LintStaged,
      disabled: existLintStagedConfigFiles(),
    })
    .build();
};
