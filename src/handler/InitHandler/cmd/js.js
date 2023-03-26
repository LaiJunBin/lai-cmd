const fs = require('fs')
const { spawn } = require('child_process')
const { requestInitEslint } = require('./utils/eslint')
const { requestInitPrettier } = require('./utils/prettier')
const { requestInitJsConfig } = require('./utils/jsconfig')
const ConfigParser = require('../../../lib/ConfigParser')
const Json2Config = require('../../../lib/JSON2Config')
const { requestYesOrNo, requestPackageManager } = require('../../../utils')
const Text = require('../../../lib/Text')

const initBabelEslintParser = async () => {
  console.log(`The ${Text.green('requires')} the following dependencies: `)
  console.log('@babel/eslint-parser')

  if (!(await requestYesOrNo('Would you like to install them now?'))) {
    console.log(
      `${Text.yellow(
        '[WARNING]'
      )}: update the eslint config file first, please don't forget to install the dependencies.`
    )
    return
  }

  const { packageManager, args } = await requestPackageManager()
  args.push('@babel/eslint-parser')

  return new Promise((resolve, reject) => {
    const shell = spawn(packageManager, args, {
      stdio: 'inherit',
      shell: true,
    })

    shell.on('close', (code) => {
      if (code !== 0) {
        const error = `${Text.red(
          'ERROR'
        )}: [@babel/eslint-parser] terminated code: ${code}`
        console.log(error)
        return reject(error)
      }

      console.log(Text.green('install @babel/eslint-parser success.'))
      resolve()
    })
  })
}

const updateEslintConfigForBabelEslintParser = async () => {
  console.log(Text.green('update eslint config for @babel/eslint-parser...'))

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

      try {
        const config = ConfigParser.parse(configFile)

        config.parser = '@babel/eslint-parser'
        if (!config.parserOptions) {
          config.parserOptions = {}
        }
        config.parserOptions.requireConfigFile = false

        Json2Config.write(configFile, config)
        console.log(Text.green('update eslint config OK...'))
      } catch {
        console.log(Text.red('update eslint config failed...'))
        console.log(Text.yellow('please update it manually.'))
        console.log(
          Text.yellow('add the following config to the eslint config file:')
        )
        console.log(
          Text.yellow(
            `{
  "parser": "@babel/eslint-parser",
  "parserOptions": {
    "requireConfigFile": false
  }
}`
          )
        )
      }

      resolve()
    } catch (e) {
      console.log(e)
      return reject(e)
    }
  })
}

const requestAddBabelParserToEslint = () => {
  return requestYesOrNo('Do you want to use @babel/eslint-parser?').then(
    (res) =>
      res &&
      initBabelEslintParser().then(updateEslintConfigForBabelEslintParser)
  )
}

const InitJs = () => {
  return requestInitEslint()
    .then(requestAddBabelParserToEslint)
    .then(requestInitPrettier)
    .then(requestInitJsConfig)
}
module.exports = InitJs
