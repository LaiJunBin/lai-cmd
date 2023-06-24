import { Tool } from '../../../../tool';
import { Framework } from '../../../framework';

const install = async (framework: Framework) => {
  console.log('change-svelte3-to-svelte install');
};

export const ChangeSvelte3ToSvelte = new Tool.Builder()
  .setInstall(install)
  .setPromptChoice({
    title: 'Change svelte3 to svelte',
  })
  .selected()
  .build();
