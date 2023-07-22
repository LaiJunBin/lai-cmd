import { Framework } from '../../../framework';
import { Tool } from '../../../../tool';
import { green, yellow } from 'kolorist';
import fs from 'fs';
import { PackageManager } from '../../../../package-manager';
import { ConfigParser } from 'config-parser-master';
import { Example } from './example';

async function installDependencies(framework: Framework) {
  console.log(green('testing-library installDependencies'));
  const dependencies = ['vitest', '@testing-library/svelte', 'jsdom'];
  await framework.packageManager.install(dependencies, true);
}

async function getScriptConfigFile() {
  if (
    fs.existsSync('tsconfig.json') ||
    (await PackageManager.isInstalled('typescript'))
  ) {
    return 'tsconfig.json';
  }

  return 'jsconfig.json';
}

async function updateConfigFile(framework: Framework) {
  console.log(green('testing-library updateConfigFile'));
  const configFile = await getScriptConfigFile();
  if (!fs.existsSync(configFile)) {
    console.log(yellow(`Cannot find ${configFile}, so create it.`));
    fs.writeFileSync(configFile, '{}');
  }

  const config = ConfigParser.parse(configFile);
  const types = config.get('compilerOptions.types', []);
  if (!types.includes('vitest/globals')) {
    types.push('vitest/globals');
    config.put('compilerOptions.types', types);
    config.save();
  }
}

async function getVitestConfigFile() {
  if (
    fs.existsSync('vitest.config.ts') ||
    (await PackageManager.isInstalled('typescript'))
  ) {
    return 'vitest.config.ts';
  }

  return 'vitest.config.js';
}

async function updateVitestConfigFile(framework: Framework) {
  console.log(green('testing-library updateVitestConfigFile'));
  const addConfig = {
    test: {
      include: ['src/**/*.{test,spec}.{js,ts}'],
      environment: 'jsdom',
      globals: true,
    },
  };

  const vitestConfigFile = await getVitestConfigFile();
  if (!fs.existsSync(vitestConfigFile)) {
    console.log(yellow(`Cannot find ${vitestConfigFile}, so create it.`));
    fs.writeFileSync(
      vitestConfigFile,
      `import { defineConfig } from 'vitest/config';

export default defineConfig({});`
    );
  }

  const config = ConfigParser.parseJs(vitestConfigFile);
  const include = [
    ...new Set([
      ...(config.get('test.include', []) as Array<string>),
      ...addConfig.test.include,
    ]),
  ];
  config.put('test.include', include);
  config.put('test.environment', addConfig.test.environment);
  config.put('test.globals', addConfig.test.globals);

  const plugins = config.get('plugins', []);

  if (plugins.some((plugin) => config.isSameCallExpression(plugin, 'svelte'))) {
    console.log(yellow('svelte plugin already exists, skip'));
    return;
  }

  config.import('@sveltejs/vite-plugin-svelte', {
    keys: ['svelte'],
  });
  plugins.push(config.createCallExpression('svelte'));
  config.put('plugins', plugins);
  config.save();
}

async function addScript(framework: Framework) {
  console.log(green('testing-library add test script'));
  await framework.packageManager.addScript('test:unit', 'vitest');
}

const install = async (framework: Framework) => {
  console.log(green('testing-library install'));
  await installDependencies(framework);
  await updateConfigFile(framework);
  await updateVitestConfigFile(framework);
  await addScript(framework);
};

export const TestingLibrary = new Tool.Builder()
  .setInstall(install)
  .setPromptChoice({
    title: 'Testing Library',
  })
  .setChildren([Example])
  .build();
