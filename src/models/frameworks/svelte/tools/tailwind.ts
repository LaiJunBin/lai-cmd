import {
  existTailwindConfigFiles,
  getTailwindConfigFileName,
} from '../../../../utils/tailwind';
import { Framework } from '../../framework';
import { Tool } from '../../../tool';
import { ConfigParser } from 'config-parser-master';
import prompts from 'prompts';
import fs from 'fs';
import {
  existPrettierConfigFiles,
  getPrettierConfigFileName,
} from '../../../../utils/prettier';
import { PackageManager } from '../../../package-manager';

async function installDependencies(framework: Framework) {
  const installedPackages = ['tailwindcss', 'postcss', 'autoprefixer'];
  await framework.packageManager.install(installedPackages, true);
  await PackageManager.npx(['tailwindcss', 'init', '-p']);
}

function updateConfigFile() {
  const configFile = getTailwindConfigFileName();
  const config = ConfigParser.parse(configFile);
  config.put('content', [
    './index.html',
    './src/**/*.{html,svelte,vue,js,ts,jsx,tsx}',
  ]);
  config.save();
}

async function updateCss() {
  const defaultCssPath = './src/index.css';
  const result = await prompts({
    type: 'text',
    name: 'cssPath',
    message: 'Please input index.css path',
    initial: defaultCssPath,
  });

  let cssPath = result.cssPath;
  if (!fs.existsSync(cssPath)) {
    cssPath = defaultCssPath;
    fs.writeFileSync(cssPath, '');
  }

  const file = cssPath;
  const data = `@tailwind base;
@tailwind components;
@tailwind utilities;

${fs.readFileSync(file).toString()}
`;

  fs.writeFileSync(file, data);
}

async function installPrettierPlugin(framework: Framework) {
  await framework.packageManager.install(['prettier-plugin-tailwindcss'], true);
}

function updatePrettierConfigFile() {
  const configFile = getPrettierConfigFileName();
  const config = ConfigParser.parse(configFile);
  const plugins = config.get('plugins', []) as Array<string>;
  if (!plugins.includes('prettier-plugin-tailwindcss')) {
    plugins.push('prettier-plugin-tailwindcss');
  }
  config.put('plugins', plugins);
  config.save();
}

const install = async (framework: Framework) => {
  console.log('Tailwind install');
  await installDependencies(framework);
  updateConfigFile();
  await updateCss();
  if (existPrettierConfigFiles()) {
    await installPrettierPlugin(framework);
    updatePrettierConfigFile();
  }
};

export const Tailwind = new Tool.Builder()
  .setInstall(install)
  .setPromptChoice({
    title: 'Tailwind',
    disabled: existTailwindConfigFiles(),
  })
  .build();
