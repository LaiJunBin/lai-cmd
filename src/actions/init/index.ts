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

async function getInitialFrameworkIndex(): Promise<number> {
  const choices = Framework.list()
    .map((type) => ({
      title: type,
      value: Framework.get(type),
    }))
    .slice(0, -1);

  const checks = choices.map(
    (choice, i) =>
      new Promise<{
        res: boolean;
        i: number;
      }>((resolve, reject) =>
        choice.value.check().then((res) => res && resolve({ res, i }), reject)
      )
  );
  checks.push(Promise.all(checks).then(() => ({ res: false, i: -1 })));
  const initial = (await Promise.race(checks)).i;
  return initial;
}

async function selectFramework(initial: number): Promise<typeof Framework> {
  const choices = Framework.list().map((type) => ({
    title: type,
    value: Framework.get(type),
  }));

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
  const getInitialFrameworkIndexPromise = getInitialFrameworkIndex();
  const packageManager = await selectPackageManager();
  const framework = await selectFramework(
    await getInitialFrameworkIndexPromise
  );
  if (framework === undefined) {
    return;
  }
  const frameworkInstance = new framework(packageManager);
  frameworkInstance.install();
};
