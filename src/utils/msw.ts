import fs from 'fs';
import { Tools } from '@/const/tools';
import { Framework } from '@/models/framework';
import { ConfigParser } from 'config-parser-master';
import { green, yellow } from 'kolorist';
import { getDevLanguage, writeFileSync, writeFileSyncIfNotExist } from '.';
import { PackageManager } from '@/lib/package-manager';
import prompts from 'prompts';

export function checkMswIsInstalled(): boolean {
  const config = ConfigParser.parse('./package.json');
  const dependencies = {
    ...config.get('dependencies', {}),
    ...config.get('devDependencies', {}),
  };
  return dependencies['msw'] !== undefined;
}

export function checkMswxIsInstalled(): boolean {
  const config = ConfigParser.parse('./package.json');
  const dependencies = {
    ...config.get('dependencies', {}),
    ...config.get('devDependencies', {}),
  };
  return dependencies['mswx'] !== undefined;
}

export async function installMSW(framework: Framework) {
  await framework.packageManager.install(['msw'], true);
}

export async function installMSWX(framework: Framework) {
  await framework.packageManager.install(['mswx'], true);
}

export function setupMSWHandler(framework: Framework) {
  console.log(green('setup msw handler'));
  if (framework.checkToBeInstalled(Tools.MSWX)) {
    console.log(yellow('MSWX will be installed, skip setup handlers for MSW'));
    return;
  }
  const extension = getDevLanguage();
  const filename = `./src/mocks/handlers.${extension}`;
  const source = `import { rest } from 'msw'
  
  export const handlers = [
    rest.get('/ping', (_, res, ctx) => {
      return res(ctx.json({ message: 'pong' }))
    }),
  ]
  `;
  writeFileSyncIfNotExist(filename, source);
}

export function setupMSWXHandler() {
  console.log(green('setup mswx handler'));
  const extension = getDevLanguage();
  const filename = `./src/mocks/handlers.${extension}`;
  if (fs.existsSync(filename)) {
    console.log(yellow('msw handler already exists, skip setup'));
    return;
  }
  const source = `import { rest } from 'mswx'

const DelayMiddleware = rest.middleware(async (req, res, ctx, next) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return next();
});

export const handlers = [
  rest.get('/ping', (_, res, ctx) => {
    return res(ctx.json({ message: 'pong' }))
  }),
].map(DelayMiddleware)
`;
  writeFileSync(filename, source);
}

export async function setupWorker(directory: string) {
  console.log(green('setup worker'));
  return await PackageManager.npx(['msw init', directory]);
}

export function setupBrowserFile() {
  console.log(green('setup browser file'));
  const extension = getDevLanguage();
  const filename = `./src/mocks/browser.${extension}`;

  const source = `import { setupWorker } from 'msw'
import { handlers } from './handlers'

// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(...handlers)  
`;
  writeFileSyncIfNotExist(filename, source);
}

export function setupServerFile() {
  console.log(green('setup server file'));
  const extension = getDevLanguage();
  const filename = `./src/mocks/server.${extension}`;
  if (fs.existsSync(filename)) {
    console.log(yellow('server file already exists, skip setup'));
    return;
  }
  const source = `import { setupServer } from 'msw/node'
import { handlers } from './handlers'

// This configures a request mocking server with the given request handlers.
export const server = setupServer(...handlers)
`;
  writeFileSync(filename, source);
}

export async function setupBrowserEntryFile(path: string) {
  console.log(green(`setup entry file: (${path})`));

  const source = `import { worker } from './mocks/browser';

if (import.meta.env.MODE === 'development') {
  worker.start({
    onUnhandledRequest: ({ url }, print) => {
      if (url.pathname.startsWith('/api')) {
        print.warning();
      }
    }
  });
}
  `;

  if (!fs.existsSync(path)) {
    console.log(yellow(`${path} not found, please input entry file path`));
    const defaultPath = `./src/index.${getDevLanguage()}`;
    const result = await prompts({
      type: 'text',
      name: 'path',
      message: 'Please input entry file path',
      initial: defaultPath,
    });
    path = result.path;
  }

  if (!fs.existsSync(path)) {
    console.log(yellow('entry file not exist, create it.'));
    writeFileSync(path, source);
    return;
  }

  if (
    ConfigParser.parseJs(path, true).isContainCallExpression('worker.start()')
  ) {
    console.log(yellow('entry file already setup, skip setup'));
    return;
  }

  const lines = fs.readFileSync(path).toString().split('\n');
  const lastImportIndex = lines.findLastIndex((line) =>
    line.startsWith('import')
  );
  lines.splice(lastImportIndex + 1, 0, source);
  writeFileSync(path, lines.join('\n'));
}

export function setupTestsEntryFile(path: string) {
  const source = `import { server } from './mocks/server.js'
// Establish API mocking before all tests.
beforeAll(() => server.listen())

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers())

// Clean up after the tests are finished.
afterAll(() => server.close())
    `;

  if (!fs.existsSync(path)) {
    console.log(yellow(`${path} not exist, create it.`));
    writeFileSync(path, source);
    return;
  }

  if (
    ConfigParser.parseJs(path, true).isContainCallExpression('server.listen()')
  ) {
    console.log(yellow(`${path} already setup, skip setup`));
    return;
  }

  const lines = fs.readFileSync(path).toString().split('\n');
  const lastImportIndex = lines.findIndex((line) => line.startsWith('import'));
  lines.splice(lastImportIndex + 1, 0, source);
  writeFileSync(path, lines.join('\n'));
}

export function setupServerEntryFile(path = '') {
  const source = `import { server } from './mocks/server.js'

server.listen()`;
  if (!path) {
    console.log(yellow('Uncertain which entry file to setup'));
    console.log(
      yellow(
        'Please add the following code to your entry file (e.g. index.js, index.ts, main.js, main.ts, etc.)'
      )
    );
    console.log(source);

    return;
  }

  console.log(green(`setup entry file: (${path})`));

  if (!fs.existsSync(path)) {
    console.log(yellow('entry file not exist, create it.'));
    writeFileSync(path, source);
    return;
  }

  if (
    ConfigParser.parseJs(path, true).isContainCallExpression('server.listen()')
  ) {
    console.log(yellow('entry file already setup, skip setup'));
    return;
  }

  const lines = fs.readFileSync(path).toString().split('\n');
  const lastImportIndex = lines.findIndex((line) => line.startsWith('import'));
  lines.splice(lastImportIndex + 1, 0, source);
  writeFileSync(path, lines.join('\n'));
}
