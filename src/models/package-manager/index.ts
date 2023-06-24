import { Npm } from './npm';
import { Yarn } from './yarn';
import { Ppnpm } from './pnpm';
import { PackageManager } from './package-manager';

export function initialPackageManager() {
  PackageManager.register('npm', new Npm());
  PackageManager.register('yarn', new Yarn());
  PackageManager.register('pnpm', new Ppnpm());
}

export { PackageManager };
