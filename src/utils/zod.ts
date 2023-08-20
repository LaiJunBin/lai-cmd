import { Framework } from '@/models/framework';
import { green, yellow } from 'kolorist';
import { getDevLanguage, getScriptConfigFile } from '.';
import { ConfigParser } from 'config-parser-master';

const installZodDependencies = async (framework: Framework) => {
  console.log(green('Zod install dependencies'));
  const installDependencies = ['zod'];
  await framework.packageManager.install(installDependencies, false);
};

const updateTypeScriptConfig = async () => {
  console.log(green('Zod update tsconfig.json'));
  const devLang = getDevLanguage();

  if (devLang !== 'ts') {
    console.log(yellow('Zod update tsconfig.json: not TypeScript, skip'));
    return;
  }

  const tsConfig = await getScriptConfigFile();
  const parsedTSConfig = ConfigParser.parse(tsConfig);
  const tsCompilerOptions = parsedTSConfig.get('compilerOptions') || {};

  if (tsCompilerOptions.strict === true) {
    console.log(
      yellow('Zod update tsconfig.json: strict already enabled, skip')
    );
    return;
  }

  console.log(green('Zod update tsconfig.json: strict'));
  tsCompilerOptions.strict = true;
  parsedTSConfig.put('compilerOptions', tsCompilerOptions);
  parsedTSConfig.save();
};

export { installZodDependencies, updateTypeScriptConfig };
