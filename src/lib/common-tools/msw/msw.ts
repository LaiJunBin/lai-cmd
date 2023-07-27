import { Framework } from '@/models/framework';
import { Tool } from '@/models/tool';
import { green } from 'kolorist';
import { Tools } from '@/const/tools';
import { checkMswIsInstalled, installMSW, setupMSWHandler } from '@/utils/msw';

export const createMSWTool = (children: Tool[]) => {
  const install = async (framework: Framework) => {
    console.log(green('MSW install'));
    await installMSW(framework);
    setupMSWHandler(framework);
  };

  return new Tool.Builder()
    .setInstall(install)
    .setPromptChoice({
      title: Tools.MSW,
      disabled: checkMswIsInstalled(),
    })
    .setChildren(children)
    .build();
};
