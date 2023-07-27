import fs from 'fs';
import { PackageManager } from '@/models/package-manager';
import { getScriptConfigFile } from '.';
import { green, yellow } from 'kolorist';
import { ConfigParser } from 'config-parser-master';
import { Framework } from '@/models/framework';

export async function getVitestConfigFile() {
  if (
    fs.existsSync('vitest.config.ts') ||
    (await PackageManager.isInstalled('typescript'))
  ) {
    return 'vitest.config.ts';
  }

  return 'vitest.config.js';
}

export async function updateScriptConfigFileForVitest() {
  const configFile = await getScriptConfigFile();
  console.log(green(`update ${configFile} compilerOptions.types for vitest`));
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

export async function updateVitestConfigFile(): Promise<string> {
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

  config.save();

  return vitestConfigFile;
}

export async function addVitestScript(framework: Framework) {
  console.log(green('Add test:unit script'));
  if (await framework.packageManager.hasScript('test:unit')) {
    console.log(yellow('test:unit script already exists, skip adding'));
    return;
  }
  await framework.packageManager.addScript('test:unit', 'vitest');
}
