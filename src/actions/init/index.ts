import prompts from 'prompts';
import { Framework } from '../../models/frameworks';
import { getInitialPackageManager } from '../../utils/get-initial-package-manager';
import { PackageManager } from '../../models/package-manager';

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
  const choices = Framework.list().map((type) => ({
    title: type,
    value: Framework.get(type),
  }));

  const checks = Promise.all(choices.map((choice) => choice.value.check()));
  const initial = (await checks).findIndex((check) => check);

  const {
    framework,
  }: {
    framework: typeof Framework;
  } = await prompts({
    type: 'select',
    name: 'framework',
    message: 'Which framework do you use?',
    choices,
    initial,
  });

  return framework;
}

export const initAction = async () => {
  const packageManager = await selectPackageManager();
  const framework = await selectFramework();
  if (framework === undefined) {
    return;
  }
  const frameworkInstance = new framework(packageManager);
  frameworkInstance.install();
};
