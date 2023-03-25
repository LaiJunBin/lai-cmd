import Text from '../../../../lib/Text'
import { spawn } from 'child_process'
import {
  requestPackageManager,
  requestYesOrNo,
  runAsyncCallbacks,
} from '../../../../utils'
import fs from 'fs'
import ConfigParser from '../../../../lib/ConfigParser'
import Json2Config from '../../../../lib/JSON2Config'
import prompts from 'prompts'
import { requestAddRecommendationExtensionToVsCodeConfig } from '.'

const runInitEslint = async () => {
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

const updateTypescriptEslintConfig = async (configPath) => {
  console.log(Text.green('update eslint config for tsconfig.json...'))

  return await new Promise((resolve, reject) => {
    try {
      const dirs = fs.readdirSync('./')
      const configs = dirs.filter((dir) => /^\.eslintrc/.test(dir))

      if (configs.length === 0) {
        throw new Error(`can't find eslint config file.`)
      }

      if (configs.length > 1) {
        throw new Error('Uncertain the eslint config file.')
      }

      const configFile = configs[0]
      const config = ConfigParser.parse(configFile)
      if (!config.parserOptions) {
        config.parserOptions = {}
      }
      config.parserOptions.project = configPath

      Json2Config.write(configFile, config)
      console.log(Text.green('update eslint config OK...'))
      resolve()
    } catch (e) {
      console.log(e)
      return reject(e)
    }
  })
}

export const requestInitEslint = (callbacks = []) => {
  return requestYesOrNo('Do you want to initialize eslint?').then(
    (res) =>
      res &&
      initEslint()
        .then(() => runAsyncCallbacks(callbacks))
        .then(() =>
          requestAddRecommendationExtensionToVsCodeConfig([
            'dbaeumer.vscode-eslint',
          ])
        )
  )
}

const requestUpdateTypescriptEslintConfig = () => {
  return requestYesOrNo('Would you like to use typescript?').then(
    async (res) => {
      if (res) {
        const result = await prompts({
          type: 'text',
          name: 'configPath',
          message: 'Please input tsconfig.json path',
          initial: './tsconfig.json',
        })
        return updateTypescriptEslintConfig(result.configPath)
      }
    }
  )
}

export const initEslint = () => {
  return runInitEslint().then(requestUpdateTypescriptEslintConfig)
}
