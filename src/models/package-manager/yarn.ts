import { spawn } from 'child_process';
import { PackageManager } from './package-manager';

export class Yarn extends PackageManager {
  public async install(
    packageNames: string[],
    devDependencies = false
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const child = spawn(
        'yarn',
        ['add', devDependencies ? '-D' : '', ...packageNames],
        {
          stdio: 'inherit',
          shell: true,
        }
      );

      child.on('error', (error) => {
        reject(error);
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject();
        }
      });
    });
  }

  public async uninstall(packageNames: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const child = spawn('yarn', ['remove', ...packageNames], {
        stdio: 'inherit',
        shell: true,
      });

      child.on('error', (error) => {
        reject(error);
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject();
        }
      });
    });
  }

  public async create(packageName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const child = spawn('yarn', ['create', packageName], {
        stdio: 'inherit',
        shell: true,
      });

      child.on('error', (error) => {
        reject(error);
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject();
        }
      });
    });
  }
}
