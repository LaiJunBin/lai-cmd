import Text from '../../../../lib/Text'
import fs from 'fs'
import ConfigParser from '../../../../lib/ConfigParser'
import Json2Config from '../../../../lib/JSON2Config'
import { requestPackageManager, requestYesOrNo } from '../../../../utils'
import { spawn } from 'child_process'

export const requestInitPrettier = () => {
  return requestYesOrNo('Do you want to initialize prettier?').then(
    (res) =>
      res &&
      initPrettier()
        .then(generatePrettierConfig)
        .then(updateEslintConfigForPrettier)
  )
}

export const initPrettier = async () => {
  console.log(`The ${Text.green('requires')} the following dependencies: `)
  console.log('prettier eslint-plugin-prettier eslint-config-prettier')

  if (!(await requestYesOrNo('Would you like to install them now?'))) {
    console.log(
      `${Text.yellow(
        '[WARNING]'
      )}: generate the config file first, please don't forget to install the dependencies.`
    )
    return
  }

  const { packageManager, args } = await requestPackageManager()
  args.push('prettier', 'eslint-plugin-prettier', 'eslint-config-prettier')

  return new Promise((resolve, reject) => {
    const shell = spawn(packageManager, args, {
      stdio: 'inherit',
      shell: true,
    })

    shell.on('close', (code) => {
      if (code !== 0) {
        const error = `${Text.red(
          'ERROR'
        )}: [prettier] terminated code: ${code}`
        console.log(error)
        return reject(error)
      }

      console.log(Text.green('init prettier success.'))
      resolve()
    })
  })
}

export const generatePrettierConfig = (
  config = {
    trailingComma: 'es5',
    tabWidth: 2,
    semi: false,
    singleQuote: true,
  }
) => {
  console.log(Text.green('generate prettier config...'))

  return new Promise((resolve, reject) => {
    try {
      Json2Config.write('.prettierrc.json', config)
      console.log(Text.green('generate prettier config OK...'))
      resolve()
    } catch (e) {
      const error = `${Text.red(
        'ERROR'
      )}: [prettier] generate config file error. \n${e}`
      console.log(error)
      return reject(error)
    }
  })
}

export const updateEslintConfigForPrettier = () => {
  console.log(Text.green('update eslint config for prettier...'))

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
      try {
        const config = ConfigParser.parse(configFile)

        config.extends = config.extends || []
        config.plugins = config.plugins || []
        config.rules = config.rules || {}

        if (typeof config.extends === 'string') {
          config.extends = [config.extends]
        }

        if (!config.extends.includes('prettier')) {
          config.extends.push('prettier')
        }

        if (!config.plugins.includes('prettier')) {
          config.plugins.push('prettier')
        }

        if (!config.rules['prettier/prettier']) {
          config.rules['prettier/prettier'] = 'error'
        }

        Json2Config.write(configFile, config)
        console.log(Text.green('update eslint config OK...'))
      } catch {
        console.log(Text.red('update eslint config error...'))
        console.log(Text.yellow('please add the following config manually:'))
        console.log(Text.yellow('extends: prettier'))
        console.log(Text.yellow('plugins: prettier'))
        console.log(Text.yellow('rules: prettier/prettier: error'))
      }

      resolve()
    } catch (e) {
      console.log(e)
      return reject(e)
    }
  })
}
