import { Framework } from '@/models/framework';
import { Tool } from '@/models/tool';
import { green } from 'kolorist';
import { Tools } from '@/const/tools';
import {
  setupServerEntryFile,
  setupServerFile,
  setupTestsEntryFile,
} from '@/utils/msw';
import { PackageManager } from '@/lib/package-manager';
import { addSetupFiles } from '@/utils/vitest';
import { getDevLanguage } from '@/utils';

export const createNodeTool = (filename = '') => {
  const install = async (framework: Framework) => {
    console.log(green('MSW node install'));
    setupServerFile();
    setupServerEntryFile(filename);

    if (
      framework.checkToBeInstalled(Tools.TestingLibrary) ||
      (await PackageManager.isInstalled('vitest'))
    ) {
      console.log(green('create setupTests file'));
      const extension = getDevLanguage();
      const path = `./src/setupTests.${extension}`;
      setupTestsEntryFile(path);
      await addSetupFiles([path]);
    }
  };

  return new Tool.Builder()
    .setInstall(install)
    .setPromptChoice({
      title: Tools.MSWNode,
    })
    .build();
};
