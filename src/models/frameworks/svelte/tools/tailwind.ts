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
import { green, yellow } from 'kolorist';

async function installDependencies(framework: Framework) {
  console.log(green('Install TailwindCSS'));
  const installedPackages = ['tailwindcss', 'postcss', 'autoprefixer'];
  await framework.packageManager.install(installedPackages, true);
  console.log(green('Init TailwindCSS config file'));
  if (existTailwindConfigFiles()) {
    console.log(yellow('TailwindCSS config file already exists, skip init'));
    return;
  }
  await PackageManager.npx(['tailwindcss', 'init', '-p']);
}

function updateConfigFile() {
  console.log(green('Update TailwindCSS config file'));
  const configFile = getTailwindConfigFileName();
  const config = ConfigParser.parse(configFile);
  const content = config.get('content', []) as Array<string>;

  if (!content.includes('./index.html')) {
    content.push('./index.html');
  }
  if (!content.includes('./src/**/*.{html,svelte,vue,js,ts,jsx,tsx}')) {
    content.push('./src/**/*.{html,svelte,vue,js,ts,jsx,tsx}');
  }

  config.put('content', content);
  config.save();
}

async function updateCss() {
  console.log(green('Update index.css file'));
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
  const cssContent = fs.readFileSync(file).toString();
  if (cssContent.includes('@tailwind')) {
    console.log(yellow('TailwindCSS already included in index.css, skip'));
    return;
  }

  const data = `@tailwind base;
@tailwind components;
@tailwind utilities;

${cssContent}
`;

  fs.writeFileSync(file, data);
}

async function installPrettierPlugin(framework: Framework) {
  console.log(green('Install Prettier TailwindCSS plugin'));
  await framework.packageManager.install(['prettier-plugin-tailwindcss'], true);
}

function updatePrettierConfigFile() {
  console.log(green('Update Prettier config file'));
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
  console.log(green('Tailwind install'));
  await installDependencies(framework);
  updateConfigFile();
  await updateCss();
  if (existPrettierConfigFiles()) {
    console.log(yellow('Prettier config file found, install Prettier plugin'));
    await installPrettierPlugin(framework);
    updatePrettierConfigFile();
  }
};

export const Tailwind = new Tool.Builder()
  .setInstall(install)
  .setPromptChoice({
    title: 'Tailwind',
  })
  .build();
