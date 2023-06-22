import prompts from 'prompts';
import { Framework } from '../../models/frameworks/framework';
import { React } from '../../models/frameworks/react';
import { Vue } from '../../models/frameworks/vue';
import { Svelte } from '../../models/frameworks/svelte';
import { Others } from '../../models/frameworks/others';
import { PackageManager } from '../../models/pacakge-manager';

export const initAction = async () => {
  const {
    packageManager,
  }: {
    packageManager: PackageManager;
  } = await prompts({
    type: 'select',
    name: 'packageManager',
    message: 'Which package manager do you use?',
    choices: [
      { title: 'npm', value: new PackageManager('npm') },
      { title: 'yarn', value: new PackageManager('yarn') },
      { title: 'pnpm', value: new PackageManager('pnpm') },
    ],
  });

  const {
    framework,
  }: {
    framework: typeof Framework;
  } = await prompts({
    type: 'select',
    name: 'framework',
    message: 'Which framework do you use?',
    choices: [
      { title: 'React', value: React },
      { title: 'Vue', value: Vue },
      { title: 'Svelte', value: Svelte },
      { title: 'None of the above', value: Others },
    ],
  });

  const frameworkInstance = new framework(packageManager);
  frameworkInstance.install();
};
