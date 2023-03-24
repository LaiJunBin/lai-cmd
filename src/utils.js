import Text from './lib/Text'
import prompts from 'prompts'

const promptly = require('promptly')

export const handleWrapper = (fn) => {
  return fn
    .then(() => {
      console.log(Text.green('All done.'))
    })
    .catch((err) => {
      console.log(`${Text.red('[ERROR]')}: ${err}`)
    })
}

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
