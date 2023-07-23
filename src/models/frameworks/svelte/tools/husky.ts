import { existHuskyConfigFiles } from '../../../../utils/exist-husky-config-files';
import { Framework } from '../../framework';
import { Tool } from '../../../tool';
import { PackageManager } from '../../../package-manager';
import { green, red, yellow } from 'kolorist';
import { InitGit, checkGit } from '../../../../utils/git';

const install = async (framework: Framework) => {
  console.log(green('husky install'));

  if (!checkGit()) {
    console.log(yellow('Not a git repository, initialize git repository...'));
    try {
      await InitGit();
    } catch {
      console.log(
        red('Failed to initialize git repository, skip husky install')
      );
      return;
    }
  }

  await framework.packageManager.install(['husky'], true);
  await PackageManager.npx(['husky', 'install']);
  console.log(green('npm set-script prepare "husky install"'));
  await framework.packageManager.addScript('prepare', 'husky install');
  console.log(green('husky add .husky/pre-commit "echo pre-commit"'));
  await PackageManager.npx([
    'husky',
    'add',
    '.husky/pre-commit',
    '"echo pre-commit"',
  ]);
  console.log(green('husky install done'));
};

export const Husky = new Tool.Builder()
  .setInstall(install)
  .setPromptChoice({
    title: 'Husky',
    disabled: existHuskyConfigFiles(),
  })
  .build();
