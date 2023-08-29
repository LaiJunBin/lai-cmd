import { Tools } from '@/const/tools';
import { Tool } from '@/models/tool';
import { green } from 'kolorist';
import { Framework } from '../frameworks';
import { installAxiosDependencies } from '@/utils/axios';

const createAxiosTool = () => {
  const install = async (framework: Framework) => {
    console.log(green('Axios install: start'));
    await installAxiosDependencies(framework);
    console.log(green('Axios install: done'));
  };

  return new Tool.Builder()
    .setInstall(install)
    .setPromptChoice({
      title: Tools.Axios,
    })
    .build();
};

export { createAxiosTool };
