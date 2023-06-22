import fs from 'fs';

export async function pushExtendsToESLintConfigFiles(
  configExtensionType: '.js' | '.cjs' | '.yml' | '.json',
  extendsName: string
) {
  switch (configExtensionType) {
    case '.js':
    case '.cjs':
      const eslintConfig = fs.readFileSync(`.eslintrc${configExtensionType}`);
      const eslintConfigString = eslintConfig.toString();
      const eslintConfigStringWithExtends = eslintConfigString.replace(
        /(['"])extends(['"]): \[(\n([ \t]*)[^\]]*)(['"])/,
        `$1extends$1: [$3$1,\n$4$1${extendsName}$1`
      );
      fs.writeFileSync(
        `.eslintrc${configExtensionType}`,
        eslintConfigStringWithExtends
      );
      break;
    case '.yml':
      throw new Error('Not implemented yet');
      break;
    case '.json':
      const eslintConfigJson = JSON.parse(
        fs.readFileSync(`.eslintrc${configExtensionType}`, 'utf-8')
      );
      eslintConfigJson.extends.push(extendsName);
      fs.writeFileSync(
        `.eslintrc${configExtensionType}`,
        JSON.stringify(eslintConfigJson, null, 2)
      );
      break;
    default:
      break;
  }
}
