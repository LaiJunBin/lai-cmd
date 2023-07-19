import { Framework } from '../../../framework';
import { Tool } from '../../../../tool';
import { ConfigParser } from 'config-parser-master';
import { getDevLanguage, writeFileSync } from '../../../../../utils';
import { green, yellow } from 'kolorist';
import fs from 'fs';

const checkMswxIsInstalled = (): boolean => {
  const config = ConfigParser.parse('./package.json');
  const dependencies = {
    ...config.get('dependencies', {}),
    ...config.get('devDependencies', {}),
  };
  return dependencies['mswx'] !== undefined;
};

const setupHandler = async () => {
  console.log(green('setup mswx handler'));
  const extension = await getDevLanguage();
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
};

const install = async (framework: Framework) => {
  console.log(green('MSWX install'));
  await framework.packageManager.install(['mswx'], true);
  await setupHandler();
};

export const MSWX = new Tool.Builder()
  .setInstall(install)
  .setPromptChoice({
    title: 'mswx',
    disabled: checkMswxIsInstalled(),
  })
  .build();
