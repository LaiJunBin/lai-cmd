import { Framework } from '../../framework';
import { Tool } from '../../../tool';
import { existESLintConfigFiles } from '../../../../utils/exist-eslint-config-files';

const install = async (framework: Framework) => {
  console.log('eslint install');
};

export const ESLint = new Tool.Builder()
  .setInstall(install)
  .setPromptChoice({
    title: 'ESLint',
    disabled: existESLintConfigFiles(),
  })
  .build();
