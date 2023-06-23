import prompts from 'prompts';
import { Framework } from '../../models/frameworks/framework';
import { Svelte } from '../../models/frameworks/svelte/svelte';
import {
  PackageManager,
  PackageManagerType,
} from '../../models/pacakge-manager';
import { getInitialPackageManager } from '../../utils/get-initial-package-manager';
import { React } from '../../models/frameworks/react/react';
import { Vue } from '../../models/frameworks/vue/vue';
import { Others } from '../../models/frameworks/others/others';

async function selectPackageManager(): Promise<PackageManagerType> {
  const choices = [
    { title: 'npm', value: 'npm' },
    { title: 'yarn', value: 'yarn' },
    { title: 'pnpm', value: 'pnpm' },
  ];

  const initialPackageManager = getInitialPackageManager();
  const initial =
    choices.findIndex((choice) => choice.value === initialPackageManager) || 0;

  const {
    packageManager,
  }: {
    packageManager: PackageManagerType;
  } = await prompts({
    type: 'select',
    name: 'packageManager',
    message: 'Which package manager do you use?',
    initial,
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
      { title: 'Vue', value: Vue },
      { title: 'React', value: React },
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
