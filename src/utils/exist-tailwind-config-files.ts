import { existsSync } from 'fs';

export function existTailwindConfigFiles(): boolean {
  return existsSync('tailwind.config.js');
}
