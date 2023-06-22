import { getInitialPackageManager } from '../get-initial-package-manager';
import fs, { Dirent } from 'fs';

describe('test get initial package manager', async () => {
  test('test npm', async () => {
    vi.spyOn(fs, 'readdirSync').mockReturnValue([
      'package-lock.json',
    ] as unknown as Dirent[]);

    expect(getInitialPackageManager()).toBe('npm');
  });

  test('test yarn', async () => {
    vi.spyOn(fs, 'readdirSync').mockReturnValue([
      'yarn.lock',
    ] as unknown as Dirent[]);

    expect(getInitialPackageManager()).toBe('yarn');
  });

  test('test pnpm', async () => {
    vi.spyOn(fs, 'readdirSync').mockReturnValue([
      'pnpm-lock.yaml',
    ] as unknown as Dirent[]);

    expect(getInitialPackageManager()).toBe('pnpm');
  });

  test('test default is npm', async () => {
    vi.spyOn(fs, 'readdirSync').mockReturnValue([] as unknown as Dirent[]);

    expect(getInitialPackageManager()).toBe('npm');
  });
});
