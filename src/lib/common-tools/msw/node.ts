import { Framework } from '@/models/framework';
import { Tool } from '@/models/tool';
import { green } from 'kolorist';
import { Tools } from '@/const/tools';
import { setupServerEntryFile, setupServerFile } from '@/utils/msw';

export const createNodeTool = (filename = '') => {
  const install = async (framework: Framework) => {
    console.log(green('MSW node install'));
    setupServerFile();
    setupServerEntryFile(filename);
  };

  return new Tool.Builder()
    .setInstall(install)
    .setPromptChoice({
      title: Tools.MSWNode,
    })
    .build();
};
