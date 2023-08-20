import { Tools } from '@/const/tools';
import { Tool } from '@/models/tool';
import { green } from 'kolorist';
import { Framework } from '../frameworks';
import { installZodDependencies, updateTypeScriptConfig } from '@/utils/zod';

const createZodTool = () => {
  const install = async (framework: Framework) => {
    console.log(green('Zod install'));
    await installZodDependencies(framework);
    await updateTypeScriptConfig();
  };

  return new Tool.Builder()
    .setInstall(install)
    .setPromptChoice({
      title: Tools.Zod,
    })
    .build();
};

export { createZodTool };
