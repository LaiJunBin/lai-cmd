import prompts from 'prompts';
import { Framework } from '../../models/frameworks/framework';
import { React } from '../../models/frameworks/react';
import { Vue } from '../../models/frameworks/vue';
import { Svelte } from '../../models/frameworks/svelte';
import { Others } from '../../models/frameworks/others';
import {
  PackageManager,
  PackageManagerType,
} from '../../models/pacakge-manager';

async function selectPackageManager(): Promise<PackageManagerType> {
  const choices = [
    { title: 'npm', value: 'npm' },
    { title: 'yarn', value: 'yarn' },
    { title: 'pnpm', value: 'pnpm' },
  ];

  const {
    packageManager,
  }: {
    packageManager: PackageManagerType;
  } = await prompts({
    type: 'select',
    name: 'packageManager',
    message: 'Which package manager do you use?',
    choices,
  });

  return packageManager;
}

async function selectFramework(): Promise<typeof Framework> {
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

  return framework;
}

export const initAction = async () => {
  const packageManager = await selectPackageManager();
  const packageManagerInstance = new PackageManager(packageManager);

  const framework = await selectFramework();
  const frameworkInstance = new framework(packageManagerInstance);
  frameworkInstance.install();
};
