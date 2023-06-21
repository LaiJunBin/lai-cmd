import { spawn } from 'child_process';

export class PackageManager {
  private tool: 'npm' | 'yarn' | 'pnpm';

  constructor(tool: 'npm' | 'yarn' | 'pnpm') {
    this.tool = tool;
  }

  public async install(
    packages: string[],
    devDependencies = false
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const child = spawn(
        this.tool,
        ['i', devDependencies ? '-D' : '', ...packages],
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
}
