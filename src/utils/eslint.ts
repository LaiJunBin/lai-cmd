import fs from 'fs';

export function existESLintConfigFiles(): boolean {
  return fs.readdirSync('.').some((fileName) => {
    return fileName.startsWith('.eslintrc');
  });
}

export function getESLintConfigFileName(): string | null {
  const extension = ['.js', '.cjs', '.yml', '.json'].find((type) =>
    fs.existsSync(`.eslintrc${type}`)
  );

  if (!extension) {
    return null;
  }

  return `.eslintrc${extension}`;
}
