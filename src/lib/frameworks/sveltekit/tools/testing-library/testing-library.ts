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

async function updateVitestConfigFileForSvelte() {
  console.log(green('testing-library updateVitestConfigFile'));

  const vitestConfigFile = await updateVitestConfigFile();
  const config = ConfigParser.parseJs(vitestConfigFile);
  const plugins = config.get('plugins', []);

  if (
    plugins.some((plugin) => config.isSameCallExpression(plugin, 'sveltekit()'))
  ) {
    console.log(yellow('sveltekit plugin already exists, skip'));
    return;
  }

  config.import('@sveltejs/kit/vite', {
    keys: ['sveltekit'],
  });
  plugins.push(config.createCallExpression('sveltekit'));
  config.put('plugins', plugins);
  config.save();
}

const install = async (framework: Framework) => {
  console.log(green('testing-library install'));
  await installTestingLibraryDependencies(framework, [
    '@testing-library/svelte',
  ]);
  await updateScriptConfigFileForVitest();
  await updateVitestConfigFileForSvelte();
  await addVitestScript(framework);
};

export const TestingLibrary = new Tool.Builder()
  .setInstall(install)
  .setPromptChoice({
    title: Tools.TestingLibrary,
  })
  .setChildren([Example])
  .build();
