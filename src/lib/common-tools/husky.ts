import { existHuskyConfigFiles, installHusky } from '@/utils/husky';
import { Framework } from '@/models/framework';
import { Tool } from '@/models/tool';
import { green } from 'kolorist';
import { Tools } from '@/const/tools';

export const createHuskyTool = () => {
  const install = async (framework: Framework) => {
    console.log(green('husky install'));
    await installHusky(framework);
  };

  return new Tool.Builder()
    .setInstall(install)
    .setPromptChoice({
      title: Tools.Husky,
      disabled: existHuskyConfigFiles(),
    })
    .build();
};
