import { Framework } from '@/models/framework';
import { green } from 'kolorist';

const installAxiosDependencies = async (framework: Framework) => {
  console.log(green('Axios install dependencies'));
  const installDependencies = ['axios'];
  await framework.packageManager.install(installDependencies, false);
};

export { installAxiosDependencies };
