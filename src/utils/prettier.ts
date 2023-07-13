import fs from 'fs';

export function existPrettierConfigFiles(): boolean {
  return fs.readdirSync('.').some((fileName) => {
    return fileName.startsWith('.prettierrc');
  });
}

export function getPrettierConfigFileName(): string | null {
  const extension = ['.js', '.cjs', '.yml', '.json', ''].find((type) =>
    fs.existsSync(`.prettierrc${type}`)
  );

  if (extension === undefined) {
    return null;
  }

  return `.prettierrc${extension}`;
}
