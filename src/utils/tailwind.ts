import { PackageManager } from '@/lib/package-manager';
import { Framework } from '@/models/framework';
import { ConfigParser } from 'config-parser-master';
import fs from 'fs';
import { green, yellow } from 'kolorist';
import prompts from 'prompts';
import { getPrettierConfigFileName } from './prettier';

export function existTailwindConfigFiles(): boolean {
  return fs.readdirSync('.').some((fileName) => {
    return fileName.startsWith('tailwind.config.');
  });
}

export function getTailwindConfigFileName(): string | null {
  const extension = ['.js', '.cjs'].find((type) =>
    fs.existsSync(`tailwind.config${type}`)
  );

  if (!extension) {
    return null;
  }

  return `tailwind.config${extension}`;
}

export async function installTailwindDependencies(framework: Framework) {
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

export function updateTailwindConfigFile() {
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

export async function updateTailwindCss(cssPath: string) {
  console.log(green(`Update css file, try to update ${cssPath}`));
  if (!fs.existsSync(cssPath)) {
    console.log(yellow(`${cssPath} not found, please input css path`));
    const defaultCssPath = './src/index.css';
    const result = await prompts({
      type: 'text',
      name: 'cssPath',
      message: 'Please input index.css path',
      initial: defaultCssPath,
    });
    cssPath = result.cssPath;
  }

  if (!fs.existsSync(cssPath)) {
    console.log(yellow(`${cssPath} not found, create it`));
    fs.writeFileSync(cssPath, '');
  }

  const cssContent = fs.readFileSync(cssPath).toString();
  if (cssContent.includes('@tailwind')) {
    console.log(yellow(`TailwindCSS already included in ${cssPath}, skip`));
    return;
  }

  const data = `@tailwind base;
@tailwind components;
@tailwind utilities;

${cssContent}
`;

  fs.writeFileSync(cssPath, data);
}

export async function installTailwindPrettierPlugin(framework: Framework) {
  console.log(green('Install Prettier TailwindCSS plugin'));
  await framework.packageManager.install(
    ['prettier-plugin-tailwindcss@^0.4'],
    true
  );
}

export function updatePrettierConfigFileForTailwind() {
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
