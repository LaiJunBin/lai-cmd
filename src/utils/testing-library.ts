import { Framework } from '@/models/framework';
import { green } from 'kolorist';

export async function installTestingLibraryDependencies(
  framework: Framework,
  dependencies: string[]
) {
  console.log(green('testing-library installDependencies'));
  await framework.packageManager.install(
    ['vitest', 'jsdom', ...dependencies],
    true
  );
}
