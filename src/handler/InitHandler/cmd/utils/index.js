import Text from '../../../../lib/Text'
import { spawn } from 'child_process'

export const runInitJs = () => {
  return new Promise((resolve, reject) => {
    const shell = spawn('npx', ['lai-cmd', 'init', 'js'], {
      stdio: 'inherit',
      shell: true,
    })

    shell.on('close', (code) => {
      if (code !== 0) {
        const error = `${Text.red('ERROR')}: [init js] terminated code: ${code}`
        console.log(error)
        return reject(error)
      }

      resolve()
    })
  })
}
