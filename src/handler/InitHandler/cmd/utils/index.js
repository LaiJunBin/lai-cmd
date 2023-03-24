import Text from '../../../../lib/Text'
import { spawn } from 'child_process'
const { requestYesOrNo } = require('../../../../utils')

const runInitJs = () => {
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

export const requestRunInitJs = () => {
  return requestYesOrNo(
    'Do you want to initialize js(eslint + prettier + jsconfig) with lai-cmd? '
  ).then((res) => res && runInitJs())
}
