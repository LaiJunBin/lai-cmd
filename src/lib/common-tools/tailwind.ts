import {
  installTailwindDependencies,
  installTailwindPrettierPlugin,
  updatePrettierConfigFileForTailwind,
  updateTailwindConfigFile,
  updateTailwindCss,
} from '@/utils/tailwind';
import { Framework } from '@/models/framework';
import { Tool } from '@/models/tool';

import { existPrettierConfigFiles } from '@/utils/prettier';
import { green, yellow } from 'kolorist';
import { Tools } from '@/const/tools';

export const createTailwindTool = (cssPath: string) => {
  const install = async (framework: Framework) => {
    console.log(green('Tailwind install'));
    await installTailwindDependencies(framework);
    updateTailwindConfigFile();
    await updateTailwindCss(cssPath);
    if (existPrettierConfigFiles()) {
      console.log(
        yellow('Prettier config file found, install Prettier plugin')
      );
      await installTailwindPrettierPlugin(framework);
      updatePrettierConfigFileForTailwind();
    }
  };

  return new Tool.Builder()
    .setInstall(install)
    .setPromptChoice({
      title: Tools.Tailwind,
    })
    .build();
};
