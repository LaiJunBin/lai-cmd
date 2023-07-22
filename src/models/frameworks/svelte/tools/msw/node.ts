import { Framework } from '../../../framework';
import { Tool } from '../../../../tool';
import { getDevLanguage, writeFileSync } from '../../../../../utils';
import { green, yellow } from 'kolorist';
import fs from 'fs';

const setupServerFile = async () => {
  console.log(green('setup server file'));
  const extension = await getDevLanguage();
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
};

const install = async (framework: Framework) => {
  console.log(green('MSW node install'));
  await setupServerFile();

  console.log(yellow('Uncertain which entry file to setup'));
  console.log(
    yellow(
      'Please add the following code to your entry file (e.g. index.js, index.ts, main.js, main.ts, etc.)'
    )
  );
  console.log(`import { server } from './mocks/server.js'
// Establish API mocking before all tests.
beforeAll(() => server.listen())

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers())

// Clean up after the tests are finished.
afterAll(() => server.close())
  `);
};

export const Node = new Tool.Builder()
  .setInstall(install)
  .setPromptChoice({
    title: 'Node',
  })
  .build();
