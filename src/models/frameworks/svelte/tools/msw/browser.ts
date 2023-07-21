import { Framework } from '../../../framework';
import { Tool } from '../../../../tool';
import { PackageManager } from '../../../../package-manager';
import fs from 'fs';
import { getDevLanguage, writeFileSync } from '../../../../../utils';
import { green, yellow } from 'kolorist';
import { ConfigParser } from 'config-parser-master';

const setupWorker = async () => {
  console.log(green('setup worker'));
  let directory = './public';
  if (await PackageManager.isInstalled('@sveltejs/kit')) {
    directory = './static';
  }

  return await PackageManager.npx(['msw init', directory]);
};

const setupBrowserFile = async () => {
  console.log(green('setup browser file'));
  const extension = await getDevLanguage();
  const filename = `./src/mocks/browser.${extension}`;
  if (fs.existsSync(filename)) {
    console.log(yellow('browser file already exists, skip setup'));
    return;
  }
  const source = `import { setupWorker } from 'msw'
import { handlers } from './handlers'

// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(...handlers)  
`;
  writeFileSync(filename, source);
};

const setupSveltekitEntryFile = async () => {
  console.log(green('setup sveltekit client entry file'));
  const extension = await getDevLanguage();
  const filename = `./src/hooks.client.${extension}`;
  if (fs.existsSync(filename)) {
    console.log(
      yellow('sveltekit browser entry file already exists, skip setup')
    );
    return;
  }
  const source = `import { worker } from './mocks/browser';

if (process.env.NODE_ENV === 'development') {
  worker.start({
    onUnhandledRequest: ({ url }, print) => {
      if (url.pathname.startsWith('/api')) {
        print.warning();
      }
    }
  });
}
  `;
  writeFileSync(filename, source);
};

const setupSvelteEntryFile = async () => {
  console.log(green('setup svelte client entry file'));
  const extension = await getDevLanguage();
  const filename = `./src/main.${extension}`;

  if (
    ConfigParser.parseJs(filename, true).isContainCallExpression('worker.start')
  ) {
    console.log(yellow('svelte entry file already setup, skip setup'));
    return;
  }

  const source = `import { worker } from './mocks/browser';

if (process.env.NODE_ENV === 'development') {
  worker.start({
    onUnhandledRequest: ({ url }, print) => {
      if (url.pathname.startsWith('/api')) {
        print.warning();
      }
    }
  });
}
  `;
  const lines = fs.readFileSync(filename).toString().split('\n');
  const lastImportIndex = lines.findIndex((line) => line.startsWith('import'));
  lines.splice(lastImportIndex + 1, 0, source);
  writeFileSync(filename, lines.join('\n'));
};

const setupEntryFile = async () => {
  console.log(green('setup entry file'));
  if (await PackageManager.isInstalled('@sveltejs/kit')) {
    await setupSveltekitEntryFile();
  } else {
    await setupSvelteEntryFile();
  }
};

const install = async (framework: Framework) => {
  console.log(green('MSW browser install'));
  await setupWorker();
  await setupBrowserFile();
  await setupEntryFile();
};

export const Browser = new Tool.Builder()
  .setInstall(install)
  .setPromptChoice({
    title: 'Browser',
  })
  .build();
