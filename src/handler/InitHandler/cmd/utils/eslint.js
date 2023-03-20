import Text from '../../../../lib/Text'
import { spawn } from 'child_process'

export const initEslint = () => {
  console.log(Text.green('Start eslint init...'))

  return new Promise((resolve, reject) => {
    const shell = spawn('npx', ['eslint', '--init'], {
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
