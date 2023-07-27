import { existHuskyConfigFiles } from '@/utils/husky';
import { Framework } from '@/models/framework';
import { Tool } from '@/models/tool';
import { Tools } from '@/const/tools';

const install = async (framework: Framework) => {
  console.log('husky install');
};

export const Husky = new Tool.Builder()
  .setInstall(install)
  .setPromptChoice({
    title: Tools.Husky,
    disabled: existHuskyConfigFiles(),
  })
  .build();
