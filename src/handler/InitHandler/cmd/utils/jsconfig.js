import Text from '../../../../lib/Text'
import { requestYesOrNo } from '../../../../utils'
import Json2Config from '../../../../lib/JSON2Config'

const generateJsConfig = () => {
  console.log(Text.green('generate jsconfig for vscode...'))
  const config = {
    compilerOptions: {
      checkJs: true,
      baseUrl: './src',
      target: 'ES2015',
      moduleResolution: 'node',
    },
  }

  return new Promise((resolve, reject) => {
    try {
      Json2Config.write('jsconfig.json', config)
      console.log(Text.green('generate jsconfig OK...'))
      resolve()
    } catch (e) {
      const error = `${Text.red(
        'ERROR'
      )}: [jsconfig] generate file error. \n${e}`
      console.log(error)
      return reject(error)
    }
  })
}

export const requestInitJsConfig = () => {
  return requestYesOrNo('Do you want to initialize jsconfig?').then(
    (res) => res && generateJsConfig()
  )
}
