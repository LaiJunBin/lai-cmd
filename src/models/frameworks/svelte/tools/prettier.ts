import { existPrettierConfigFiles } from '../../../../utils/exist-prettier-config-files';
import { Framework } from '../../framework';
import { Tool } from '../../../tool';

const install = async (framework: Framework) => {
  console.log('prettier install');
};

export const Prettier = new Tool.Builder()
  .setInstall(install)
  .setPromptChoice({
    title: 'Prettier',
    disabled: existPrettierConfigFiles(),
  })
  .build();
