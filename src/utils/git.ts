import fs from 'fs';
import { spawn } from 'child_process';

export function checkGit(): boolean {
  return fs.existsSync('.git');
}

export function InitGit(): Promise<void> {
  console.log('Initializing git repository...');
  return new Promise<void>((resolve, reject) => {
    const child = spawn('git', ['init'], {
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
