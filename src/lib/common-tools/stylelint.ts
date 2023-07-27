import { Framework } from '@/models/framework';
import { Tool } from '@/models/tool';
import { green } from 'kolorist';
import {
  addStyleLintScript,
  installStyleLintDependencies,
  updateStyleLintConfigFile,
  updateVSCodeExtensionsFileForStyleLint,
  updateVSCodeSettingsForStyleLint,
} from '@/utils/stylelint';
import { Tools } from '@/const/tools';

export const createStyleLintTool = () => {
  const install = async (framework: Framework) => {
    console.log(green('StyleLint install'));
    await installStyleLintDependencies(framework);
    await updateStyleLintConfigFile(framework);
    await addStyleLintScript(framework);
    updateVSCodeExtensionsFileForStyleLint();
    updateVSCodeSettingsForStyleLint();
  };

  return new Tool.Builder()
    .setInstall(install)
    .setPromptChoice({
      title: Tools.StyleLint,
    })
    .build();
};
