import { Framework } from '@/models/framework';
import { green } from 'kolorist';
import { getDevLanguage, getScriptConfigFile } from '.';
import { ConfigParser } from 'config-parser-master';

const installZodDependencies = async (framework: Framework) => {
  console.log(green('Zod install dependencies'));
  const installDependencies = ['zod'];
  await framework.packageManager.install(installDependencies, false);
};

const updateTypeScriptConfig = async () => {
  const devLang = getDevLanguage();

  if (devLang !== 'ts') {
    return;
  }

  const tsConfig = await getScriptConfigFile();
  const parsedTSConfig = ConfigParser.parse(tsConfig);
  const tsCompilerOptions = parsedTSConfig.get('compilerOptions') || {};

  if (!tsCompilerOptions.strict) {
    tsCompilerOptions.strict = true;
    parsedTSConfig.put('compilerOptions', tsCompilerOptions);
    parsedTSConfig.save();
  }
};

export { installZodDependencies, updateTypeScriptConfig };
