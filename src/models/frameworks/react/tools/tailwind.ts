import { existTailwindConfigFiles } from '../../../../utils/tailwind';
import { Framework } from '../../framework';
import { Tool } from '../../../tool';

const install = async (framework: Framework) => {
  console.log('tailwind install');
};

export const Tailwind = new Tool.Builder()
  .setInstall(install)
  .setPromptChoice({
    title: 'Tailwind',
    disabled: existTailwindConfigFiles(),
  })
  .build();
