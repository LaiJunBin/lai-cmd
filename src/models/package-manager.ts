import { spawn } from 'child_process';

export abstract class PackageManager {
  abstract install(
    packageNames: string[],
    devDependencies: boolean
  ): Promise<void>;
  abstract uninstall(packageNames: string[]): Promise<void>;
  abstract create(packageName: string): Promise<void>;

  static packageManagers: { [key: string]: PackageManager } = {};

  static register(type: string, packageManager: PackageManager) {
    PackageManager.packageManagers[type] = packageManager;
  }

  static get(type: string): PackageManager {
    const packageManager = PackageManager.packageManagers[type];
    if (!packageManager) {
      throw new Error(`Unsupported package manager: ${type}`);
    }
    return packageManager;
  }

  static list(): string[] {
    return Object.keys(PackageManager.packageManagers);
  }

  static async isInstalled(packageName: string): Promise<boolean> {
    const keys = ['dependencies', 'devDependencies', 'peerDependencies'];
    const dependencies = {};
    await Promise.all(
      keys.map((key) => {
        return new Promise((resolve, reject) => {
          const child = spawn('npm', ['pkg', 'get', key], {
            shell: true,
          });

          child.stdout.on('data', (data) => {
            Object.assign(dependencies, JSON.parse(data.toString()));
          });

          child.on('error', (error) => {
            reject(error);
          });

          child.on('close', (code) => {
            if (code === 0) {
              resolve(true);
            } else {
              reject();
            }
          });
        });
      })
    );

    return Object.keys(dependencies).includes(packageName);
  }

  static npx(args: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const child = spawn('npx', args, {
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

  hasScript(scriptName: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const child = spawn('npm', ['pkg', 'get', `scripts.${scriptName}`], {
        shell: true,
      });

      child.on('error', (error) => {
        reject(error);
      });

      child.on('close', (code) => {
        if (code !== 0) {
          reject();
        }
      });

      child.stdout.on('data', (data) => {
        if (data.toString().trim() === '{}' || data.toString().trim() === '') {
          resolve(false);
        }

        resolve(true);
      });
    });
  }

  addScript(scriptName: string, script: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const child = spawn(
        'npm',
        ['pkg', 'set', `scripts.${scriptName}="${script}"`],
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
}
