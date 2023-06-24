import prompts from 'prompts';
import { Framework } from '../../models/frameworks/framework';
import { Svelte } from '../../models/frameworks/svelte/svelte';
import { getInitialPackageManager } from '../../utils/get-initial-package-manager';
import { React } from '../../models/frameworks/react/react';
import { Vue } from '../../models/frameworks/vue/vue';
import { Others } from '../../models/frameworks/others/others';
import {
  PackageManager,
  initialPackageManager,
} from '../../models/package-manager';

async function selectPackageManager(): Promise<PackageManager> {
  const choices = PackageManager.list().map((type) => ({
    title: type,
    value: PackageManager.get(type),
  }));

  const initialPackageManager = getInitialPackageManager();
  const initial =
    choices.findIndex((choice) => choice.title === initialPackageManager) || 0;

  const {
    packageManager,
  }: {
    packageManager: PackageManager;
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
  initialPackageManager();

  const packageManager = await selectPackageManager();
  const framework = await selectFramework();
  const frameworkInstance = new framework(packageManager);
  frameworkInstance.install();
};
