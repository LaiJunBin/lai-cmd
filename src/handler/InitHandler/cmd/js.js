const { spawn } = require('child_process')
const Text = require('../../../lib/Text')
const promptly = require('promptly')
const fs = require('fs')
const ConfigParser = require('../../../lib/ConfigParser')
const Json2Config = require('../../../lib/JSON2Config')

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

const requestInitPrettier = async () => {
  const flag =
    (
      await promptly.prompt('Do you want to initialize prettier? (y)', {
        default: 'y',
      })
    ).toLowerCase() !== 'n'
  return new Promise((resolve, reject) => {
    if (flag) {
      resolve()
    } else {
      reject(new Error('command canceled.'))
    }
  })
}

const initPrettier = async () => {
  console.log(`The ${Text.green('requires')} the following dependencies: `)
  console.log('prettier eslint-plugin-prettier eslint-config-prettier')
  const flag =
    (
      await promptly.prompt(
        'Would you like to install them now with npm? (y)',
        {
          default: 'y',
        }
      )
    ).toLowerCase() !== 'n'

  return new Promise((resolve, reject) => {
    if (!flag) {
      console.log(
        `${Text.yellow(
          '[WARNING]'
        )}: generate the config file first, please don't forget to install the dependencies.`
      )
      return resolve()
    }

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

const updateEslintConfig = () => {
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
  initEslint()
    .then(requestInitPrettier)
    .then(initPrettier)
    .then(generatePrettierConfig)
    .then(updateEslintConfig)
    .finally(generateJsConfig)
    .then(() => {
      console.log(Text.green('All done.'))
    })
    .catch((err) => {
      console.log(`${Text.red('[ERROR]')}: ${err}`)
    })
}
module.exports = InitJs
