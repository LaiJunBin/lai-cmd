import prompts from 'prompts'
import ConfigParser from './lib/ConfigParser'
import promptly from 'promptly'

export const runAsyncCallbacks = async (callbacks = []) => {
  if (!Array.isArray(callbacks)) {
    callbacks = [callbacks]
  }

  for (const callback of callbacks) {
    await callback()
  }
}

export const requestYesOrNo = async (message, defaultYes = true) => {
  return (
    (
      await promptly.prompt(`${message} (${defaultYes ? 'y' : 'n'})`, {
        default: defaultYes ? 'y' : 'n',
      })
    ).toLowerCase() !== 'n'
  )
}

export const requestPackageManager = async () => {
  const result = await prompts({
    type: 'select',
    name: 'packageManager',
    message: 'Select a package manager',
    choices: [
      { title: 'npm', value: 'npm' },
      { title: 'yarn', value: 'yarn' },
      { title: 'pnpm', value: 'pnpm' },
    ],
    initial: 0,
  })

  const { packageManager } = result
  const args = []
  if (packageManager === 'npm') {
    args.push('i', '-D')
  } else {
    args.push('add', '-D')
  }

  return { packageManager, args }
}

export const checkModuleInstalled = (moduleName) => {
  const config = ConfigParser.parse('package.json')
  return (
    (config.dependencies?.[moduleName] ||
      config.devDependencies?.[moduleName]) !== undefined
  )
}
