import { existTailwindConfigFiles } from '@/utils/tailwind';
import { Framework } from '@/models/framework';
import { Tool } from '@/models/tool';
import { Tools } from '@/const/tools';

const install = async (framework: Framework) => {
  console.log('tailwind install');
};

export const Tailwind = new Tool.Builder()
  .setInstall(install)
  .setPromptChoice({
    title: Tools.Tailwind,
    disabled: existTailwindConfigFiles(),
  })
  .build();
