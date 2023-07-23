import fs from 'fs';

export function existStyleLintConfigFiles(): boolean {
  return fs.readdirSync('.').some((fileName) => {
    return fileName.startsWith('.stylelintrc');
  });
}

export function getStyleLintConfigFileName(): string | null {
  const extension = ['.js', '.cjs', '.yml', '.json', ''].find((type) =>
    fs.existsSync(`.stylelintrc${type}`)
  );

  if (extension === undefined) {
    return null;
  }

  return `.stylelintrc${extension}`;
}
