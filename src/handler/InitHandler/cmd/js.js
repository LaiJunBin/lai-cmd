const { spawn } = require('child_process')
const Text = require('../../../lib/Text')
const promptly = require('promptly')
const fs = require('fs')
const ConfigParser = require('../../../lib/ConfigParser')
const Json2Config = require('../../../lib/JSON2Config')
const { requestYesOrNo } = require('../../../utils')

const initEslint = () => {
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

const initPrettier = async () => {
  console.log(`The ${Text.green('requires')} the following dependencies: `)
  console.log('prettier eslint-plugin-prettier eslint-config-prettier')

  if (!(await requestYesOrNo('Would you like to install them now with npm?'))) {
    console.log(
      `${Text.yellow(
        '[WARNING]'
      )}: generate the config file first, please don't forget to install the dependencies.`
    )
    return
  }

  return new Promise((resolve, reject) => {
    const shell = spawn(
      'npm',
      [
        'i',
        '-D',
        'prettier',
        'eslint-plugin-prettier',
        'eslint-config-prettier',
      ],
      {
        stdio: 'inherit',
        shell: true,
      }
    )

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

const initBabelEslintParser = async () => {
  console.log(`The ${Text.green('requires')} the following dependencies: `)
  console.log('@babel/eslint-parser')

  if (!(await requestYesOrNo('Would you like to install them now with npm?'))) {
    console.log(
      `${Text.yellow(
        '[WARNING]'
      )}: update the eslint config file first, please don't forget to install the dependencies.`
    )
    return
  }

  return new Promise((resolve, reject) => {
    const shell = spawn('npm', ['i', '-D', '@babel/eslint-parser'], {
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
      const config = ConfigParser.parse(configFile)

      config.parser = '@babel/eslint-parser'
      if (!config.parserOptions) {
        config.parserOptions = {}
      }
      config.parserOptions.requireConfigFile = false

      Json2Config.write(configFile, config)
      console.log(Text.green('update eslint config OK...'))
      resolve()
    } catch (e) {
      console.log(e)
      return reject(e)
    }
  })
}

const generatePrettierConfig = () => {
  console.log(Text.green('generate prettier config...'))

  const config = {
    trailingComma: 'es5',
    tabWidth: 2,
    semi: false,
    singleQuote: true,
  }

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

const updateEslintConfigForPrettier = () => {
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
      const config = ConfigParser.parse(configFile)

      config.extends = config.extends || []
      config.plugins = config.plugins || []
      config.rules = config.rules || {}

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
      resolve()
    } catch (e) {
      console.log(e)
      return reject(e)
    }
  })
}

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

const InitJs = () => {
  requestYesOrNo('Do you want to initialize eslint?')
    .then((res) => res && initEslint())
    .then(() =>
      requestYesOrNo('Do you want to use @babel/eslint-parser?').then(
        (res) =>
          res &&
          initBabelEslintParser().then(updateEslintConfigForBabelEslintParser)
      )
    )
    .then(() =>
      requestYesOrNo('Do you want to initialize prettier?').then(
        (res) =>
          res &&
          initPrettier()
            .then(generatePrettierConfig)
            .then(updateEslintConfigForPrettier)
      )
    )
    .then(() =>
      requestYesOrNo('Do you want to initialize jsconfig?').then(
        (res) => res && generateJsConfig()
      )
    )
    .then(() => {
      console.log(Text.green('All done.'))
    })
    .catch((err) => {
      console.log(`${Text.red('[ERROR]')}: ${err}`)
    })
}
module.exports = InitJs
