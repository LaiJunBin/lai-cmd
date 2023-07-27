import { Framework } from '@/models/framework';
import { Tool } from '@/models/tool';
import { green } from 'kolorist';
import { Tools } from '@/const/tools';
import {
  checkMswxIsInstalled,
  installMSWX,
  setupMSWXHandler,
} from '@/utils/msw';

export const createMSWXTool = () => {
  const install = async (framework: Framework) => {
    console.log(green('MSWX install'));
    await installMSWX(framework);
    setupMSWXHandler();
  };

  return new Tool.Builder()
    .setInstall(install)
    .setPromptChoice({
      title: Tools.MSWX,
      disabled: checkMswxIsInstalled(),
    })
    .build();
};
