import Text from '../../../../lib/Text'
import { spawn } from 'child_process'
import { requestPackageManager } from '../../../../utils'

export const initEslint = async () => {
  console.log(Text.green('Start eslint init...'))

  const { packageManager } = await requestPackageManager()
  return new Promise((resolve, reject) => {
    const shell = spawn(packageManager, ['create', '@eslint/config'], {
      stdio: 'inherit',
      shell: true,
    })

    shell.on('close', (code) => {
      if (code !== 0) {
        const error = `${Text.red('ERROR')}: [eslint] terminated code: ${code}`
        console.log(error)
        return reject(error)
      }

      resolve()
    })
  })
}
