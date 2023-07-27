import { Framework } from '@/models/framework';
import { Tool } from '@/models/tool';
import { green, yellow } from 'kolorist';
import { ConfigParser } from 'config-parser-master';
import { Example } from './example';
import { installTestingLibraryDependencies } from '@/utils/testing-library';
import {
  addVitestScript,
  updateScriptConfigFileForVitest,
  updateVitestConfigFile,
} from '@/utils/vitest';
import { Tools } from '@/const/tools';
import { PackageManager } from '@/models/package-manager';

async function updateVitestConfigFileForReact() {
  console.log(green('testing-library updateVitestConfigFile'));

  const vitestConfigFile = await updateVitestConfigFile();
  const config = ConfigParser.parseJs(vitestConfigFile);
  const plugins = config.get('plugins', []);

  if (
    plugins.some((plugin) => config.isSameCallExpression(plugin, 'react()'))
  ) {
    console.log(yellow('react plugin already exists, skip'));
    return;
  }

  const importName = (await PackageManager.isInstalled(
    '@vitejs/plugin-react-swc'
  ))
    ? '@vitejs/plugin-react-swc'
    : '@vitejs/plugin-react';

  config.import(importName, {
    defaultKey: 'react',
  });
  plugins.push(config.createCallExpression('react'));
  config.put('plugins', plugins);
  config.save();
}

const install = async (framework: Framework) => {
  console.log(green('testing-library install'));
  const useSwc = await PackageManager.isInstalled('@vitejs/plugin-react-swc');
  await installTestingLibraryDependencies(framework, [
    'vite',
    useSwc ? '@vitejs/plugin-react-swc' : '@vitejs/plugin-react',
    '@testing-library/react',
  ]);
  await updateScriptConfigFileForVitest();
  await updateVitestConfigFileForReact();
  await addVitestScript(framework);
};

export const TestingLibrary = new Tool.Builder()
  .setInstall(install)
  .setPromptChoice({
    title: Tools.TestingLibrary,
  })
  .setChildren([Example])
  .build();
