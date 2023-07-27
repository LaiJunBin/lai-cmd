import fs from 'fs';
import { InitGit, checkGit } from './git';
import { green, red, yellow } from 'kolorist';
import { Framework } from '@/models/framework';
import { PackageManager } from '@/lib/package-manager';
import { existLintStagedConfigFiles } from './lintstaged';
import { Tools } from '@/const/tools';

export function existHuskyConfigFiles(): boolean {
  return fs.existsSync('.husky/pre-commit');
}

export async function installHusky(framework: Framework) {
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

  let preCommitCmd = '"echo pre-commit"';
  if (
    framework.checkToBeInstalled(Tools.LintStaged) ||
    existLintStagedConfigFiles()
  ) {
    preCommitCmd = '"npx lint-staged"';
  }
  console.log(green(`husky add .husky/pre-commit ${preCommitCmd}`));
  await PackageManager.npx(['husky', 'add', '.husky/pre-commit', preCommitCmd]);
  console.log(green('husky install done'));
}
