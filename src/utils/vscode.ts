import { ConfigParser } from 'config-parser-master';
import fs from 'fs';

export function getVSCodeSettingsFileName() {
  const vscodeSettingsFile = '.vscode/settings.json';
  if (!fs.existsSync('.vscode')) {
    fs.mkdirSync('.vscode');
  }

  if (!fs.existsSync(vscodeSettingsFile)) {
    fs.writeFileSync(vscodeSettingsFile, '{}');
  }

  return vscodeSettingsFile;
}

export function getVSCodeExtensionsFileName() {
  const vscodeExtensionsFile = '.vscode/extensions.json';
  if (!fs.existsSync('.vscode')) {
    fs.mkdirSync('.vscode');
  }

  if (!fs.existsSync(vscodeExtensionsFile)) {
    fs.writeFileSync(vscodeExtensionsFile, '{}');
  }

  return vscodeExtensionsFile;
}

export function addVSCodeExtensionsToRecommendations(
  extensions: Array<string>
) {
  const vscodeExtensionsFile = getVSCodeExtensionsFileName();
  const config = ConfigParser.parse(vscodeExtensionsFile);
  const recommendations = config.get('recommendations', []) as Array<string>;
  extensions.forEach((extension) => {
    if (!recommendations.includes(extension)) {
      recommendations.push(extension);
    }
  });

  config.put('recommendations', recommendations);
  config.save();
}
