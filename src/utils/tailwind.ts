import fs from 'fs';

export function existTailwindConfigFiles(): boolean {
  return fs.readdirSync('.').some((fileName) => {
    return fileName.startsWith('tailwind.config.');
  });
}

export function getTailwindConfigFileName(): string | null {
  const extension = ['.js', '.cjs'].find((type) =>
    fs.existsSync(`tailwind.config${type}`)
  );

  if (!extension) {
    return null;
  }

  return `tailwind.config${extension}`;
}
