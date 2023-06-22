import fs from 'fs';

export function existTailwindConfigFiles(): boolean {
  return fs.existsSync('tailwind.config.js');
}
