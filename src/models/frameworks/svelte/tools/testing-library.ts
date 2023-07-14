import { Framework } from '../../framework';
import { Tool } from '../../../tool';
import { green, yellow, red } from 'kolorist';
import fs from 'fs';
import { PackageManager } from '../../../package-manager';
import { ConfigParser } from 'config-parser-master';
import prompts from 'prompts';

async function installDependencies(framework: Framework) {
  console.log(green('testing-library installDependencies'));
  const dependencies = ['vitest', '@testing-library/svelte', 'jsdom'];
  await framework.packageManager.install(dependencies, true);
}

function getScriptConfigFile() {
  if (
    fs.existsSync('tsconfig.json') ||
    PackageManager.isInstalled('typescript')
  ) {
    return 'tsconfig.json';
  }

  return 'jsconfig.json';
}

async function updateConfigFile(framework: Framework) {
  console.log(green('testing-library updateConfigFile'));
  const configFile = getScriptConfigFile();
  if (!fs.existsSync(configFile)) {
    console.log(yellow(`Cannot find ${configFile}, so create it.`));
    fs.writeFileSync(configFile, '{}');
  }

  let config = null;
  try {
    config = ConfigParser.parse(configFile);
  } catch (e) {
    console.log(red(`Cannot parse ${configFile}.`));
    const { forceParse } = await prompts({
      type: 'toggle',
      name: 'forceParse',
      message: 'Would you like to force parse it? (comments will be removed)',
      active: 'yes',
      inactive: 'no',
      initial: true,
    });

    if (!forceParse) {
      console.log(
        yellow(`Cannot parse ${configFile}, please handle it manually.`)
      );

      console.log(
        yellow(
          `Add "vitest/globals" to "compilerOptions.types" in ${configFile}.`
        )
      );

      console.log(
        yellow(`Example: "compilerOptions": { "types": ["vitest/globals"] }`)
      );
      return;
    }

    const jsonString = fs
      .readFileSync(configFile)
      .toString()
      .replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g) =>
        g ? '' : m
      );
    fs.writeFileSync(configFile, jsonString);
    try {
      config = ConfigParser.parse(configFile);
      console.log(green(`Force parse ${configFile} successfully.`));
    } catch (e) {
      console.log(red(`Cannot parse ${configFile}.`));
      console.log(
        yellow(
          `Add "vitest/globals" to "compilerOptions.types" in ${configFile}.`
        )
      );

      console.log(
        yellow(`Example: "compilerOptions": { "types": ["vitest/globals"] }`)
      );
      return;
    }
  }

  const compilerOptions = config.get('compilerOptions', {});
  const types = compilerOptions.types || [];
  if (!types.includes('vitest/globals')) {
    types.push('vitest/globals');
    compilerOptions.types = types;
    config.put('compilerOptions', compilerOptions);
    config.save();
  }
}

function getVitestConfigFile() {
  if (
    fs.existsSync('vitest.config.ts') ||
    PackageManager.isInstalled('typescript')
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

  const vitestConfigFile = getVitestConfigFile();
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
  .build();
