import { Framework } from '../../../framework';
import { Tool } from '../../../../tool';
import { MSWX } from './mswx';
import { ConfigParser } from 'config-parser-master';
import { getDevLanguage, writeFileSync } from '../../../../../utils';
import { Browser } from './browser';
import { Node } from './node';
import { green, yellow } from 'kolorist';
import fs from 'fs';

const checkMswIsInstalled = (): boolean => {
  const config = ConfigParser.parse('./package.json');
  const dependencies = {
    ...config.get('dependencies', {}),
    ...config.get('devDependencies', {}),
  };
  return dependencies['msw'] !== undefined;
};

const setupHandler = async () => {
  console.log(green('setup msw handler'));
  const extension = await getDevLanguage();
  const filename = `./src/mocks/handlers.${extension}`;
  if (fs.existsSync(filename)) {
    console.log(yellow('msw handler already exists, skip setup'));
    return;
  }
  const source = `import { rest } from 'msw'

export const handlers = [
  rest.get('/ping', (_, res, ctx) => {
    return res(ctx.json({ message: 'pong' }))
  }),
]
`;
  writeFileSync(filename, source);
};

const install = async (framework: Framework) => {
  console.log(green('MSW install'));
  await framework.packageManager.install(['msw'], true);
  if (framework.toolsToBeInstalled.includes(MSWX)) {
    console.log(yellow('MSWX will be installed, skip setup handlers for MSW'));
    return;
  }
  await setupHandler();
};

export const MSW = new Tool.Builder()
  .setInstall(install)
  .setPromptChoice({
    title: 'Mock Service Worker(msw)',
    disabled: checkMswIsInstalled(),
  })
  .setChildren([Browser, Node, MSWX])
  .build();
