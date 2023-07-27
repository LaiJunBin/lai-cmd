import { existPrettierConfigFiles } from '@/utils/prettier';
import { Framework } from '@/models/framework';
import { Tool } from '@/models/tool';
import { Tools } from '@/const/tools';

const install = async (framework: Framework) => {
  console.log('prettier install');
};

export const Prettier = new Tool.Builder()
  .setInstall(install)
  .setPromptChoice({
    title: Tools.Prettier,
    disabled: existPrettierConfigFiles(),
  })
  .build();
