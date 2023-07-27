import { Framework } from '@/models/framework';
import { Tool } from '@/models/tool';
import { green } from 'kolorist';
import {
  setupBrowserFile,
  setupBrowserEntryFile,
  setupWorker,
} from '@/utils/msw';
import { Tools } from '@/const/tools';

export const createBrowserTool = (filename: string) => {
  const install = async (framework: Framework) => {
    console.log(green('MSW browser install'));
    await setupWorker();
    setupBrowserFile();
    setupBrowserEntryFile(filename);
  };

  return new Tool.Builder()
    .setInstall(install)
    .setPromptChoice({
      title: Tools.MSWBrowser,
    })
    .build();
};
