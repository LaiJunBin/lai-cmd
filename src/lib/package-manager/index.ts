import { Pnpm } from './pnpm';
import { Npm } from './npm';
import { PackageManager } from '@/models/package-manager';
import { Yarn } from './yarn';

PackageManager.register('npm', new Npm());
PackageManager.register('yarn', new Yarn());
PackageManager.register('pnpm', new Pnpm());

export { PackageManager };
