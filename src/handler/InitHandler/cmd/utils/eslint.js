import Text from '../../../../lib/Text'
import { spawn } from 'child_process'
import {
  checkModuleInstalled,
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

const uninstallStandardTypescriptPlugin = (packageManager) => {
  const packageName = 'eslint-config-standard-with-typescript'
  console.log(Text.green(`check ${packageName}...`))
  if (!checkModuleInstalled(packageName)) {
    console.log(
      Text.yellow(
        'eslint-config-standard-with-typescript is not installed, so skip.'
      )
    )
    return Promise.resolve()
  }

  console.log(Text.green(`uninstall ${packageName}...`))
  const operator = packageManager === 'yarn' ? 'remove' : 'uninstall'
  return new Promise((resolve, reject) => {
    const shell = spawn(packageManager, [operator, packageName], {
      stdio: 'inherit',
      shell: true,
    })

    shell.on('close', (code) => {
      if (code !== 0) {
        const error = `${Text.red(
          'ERROR'
        )}: [uninstall ${packageName}] terminated code: ${code}`
        console.log(error)
        return reject(error)
      }

      resolve()
    })
  })
}

const installTypescriptRecommendedPlugin = (packageManager) => {
  const packageName =
    '@typescript-eslint/eslint-plugin @typescript-eslint/parser'
  const operator = packageManager === 'yarn' ? 'add' : 'install'
  return new Promise((resolve, reject) => {
    const shell = spawn(packageManager, [operator, '-D', packageName], {
      stdio: 'inherit',
      shell: true,
    })

    shell.on('close', (code) => {
      if (code !== 0) {
        const error = `${Text.red(
          'ERROR'
        )}: [install ${packageName}] terminated code: ${code}`
        console.log(error)
        return reject(error)
      }

      resolve()
    })
  })
}

const tryToUpdateTypescriptExtendsRecommdationPlugin = () => {
  return new Promise((resolve, reject) => {
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
      if (!Array.isArray(config.extends)) {
        config.extends = [config.extends]
      }

      const index = config.extends.indexOf('standard-with-typescript')
      if (index === -1) {
        resolve()
      } else {
        requestYesOrNo(
          'Would you want to change standard-with-typescript extends to plugin:@typescript-eslint/recommended?'
        ).then(async (res) => {
          if (res) {
            const { packageManager } = await requestPackageManager()

            await uninstallStandardTypescriptPlugin(packageManager)
            await installTypescriptRecommendedPlugin(packageManager)
            config.extends.splice(
              index,
              1,
              'plugin:@typescript-eslint/recommended'
            )
            Json2Config.write(configFile, config)
            resolve()
          }
        })
      }
    } catch (e) {
      console.log(e)
      return reject(e)
    }
  })
}

const requestSetTsConfigPathToEslintConfig = () => {
  return requestYesOrNo('Would you want set tsconfig.json path?').then(
    (res) => res && setTsConfigPathToEslintConfig()
  )
}
const setTsConfigPathToEslintConfig = async () => {
  const result = await prompts({
    type: 'text',
    name: 'configPath',
    message: 'Please input tsconfig.json path',
    initial: './tsconfig.json',
  })
  return updateTypescriptEslintConfig(result.configPath)
}

const requestUpdateTypescriptEslintConfig = () => {
  return requestYesOrNo('Would you like to use typescript?').then(
    (res) =>
      res &&
      requestSetTsConfigPathToEslintConfig().then(
        tryToUpdateTypescriptExtendsRecommdationPlugin
      )
  )
}

export const initEslint = () => {
  return runInitEslint().then(requestUpdateTypescriptEslintConfig)
}
