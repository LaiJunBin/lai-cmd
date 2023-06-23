import { existLintStagedConfigFiles } from '../../../../utils/exist-lintstage-config-files';
import { Framework } from '../../framework';
import { Tool } from '../../../tool';

const install = async (framework: Framework) => {
  console.log('lintstage install');
};

export const LintStaged = new Tool.Builder()
  .setInstall(install)
  .setPromptChoice({
    title: 'Lint Staged',
    disabled: existLintStagedConfigFiles(),
  })
  .build();
