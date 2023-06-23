import { existHuskyConfigFiles } from '../../../../utils/exist-husky-config-files';
import { Framework } from '../../framework';
import { Tool } from '../../../tool';

const install = async (framework: Framework) => {
  console.log('husky install');
};

export const Husky = new Tool.Builder()
  .setInstall(install)
  .setPromptChoice({
    title: 'Husky',
    disabled: existHuskyConfigFiles(),
  })
  .build();
