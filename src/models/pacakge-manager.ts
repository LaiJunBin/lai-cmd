import { spawn } from 'child_process';

export type PackageManagerType = 'npm' | 'yarn' | 'pnpm';
export class PackageManager {
  private tool: PackageManagerType;

  constructor(tool: PackageManagerType) {
    this.tool = tool;
  }

  public async install(
    packageNames: string[],
    devDependencies = false
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const child = spawn(
        this.tool,
        ['i', devDependencies ? '-D' : '', ...packageNames],
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

  public async create(packageName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const child = spawn(this.tool, ['create', packageName], {
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

  public async isInstalled(packageName: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const child = spawn(this.tool, ['list', packageName], {
        stdio: 'ignore',
        shell: true,
      });

      child.on('error', (error) => {
        reject(error);
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  public async addScript(scriptName: string, script: string): Promise<void> {
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
