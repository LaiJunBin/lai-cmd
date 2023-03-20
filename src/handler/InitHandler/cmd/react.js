const { spawn } = require('child_process')
const Text = require('../../../lib/Text')
const ConfigParser = require('../../../lib/ConfigParser')
const Json2Config = require('../../../lib/JSON2Config')
const fs = require('fs')
const { requestYesOrNo, requestPackageManager } = require('../../../utils')

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

const runInitReactTailwindCSS = () => {
  return new Promise((resolve, reject) => {
    const shell = spawn('npx', ['lai-cmd', 'init', 'react-tailwindcss'], {
      stdio: 'inherit',
      shell: true,
    })

    shell.on('close', (code) => {
      if (code !== 0) {
        const error = `${Text.red(
          'ERROR'
        )}: [init react tailwindcss] terminated code: ${code}`
        console.log(error)
        return reject(error)
      }

      resolve()
    })
  })
}

const initBabelPresetReact = async () => {
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
        )}: [@babel/preset-react] terminated code: ${code}`
        console.log(error)
        return reject(error)
      }

      console.log(Text.green('install @babel/preset-react success.'))
      resolve()
    })
  })
}

const updateEslintConfigForBabelPresetReact = async () => {
  console.log(Text.green('update eslint config for @babel/preset-react...'))

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

      if (!config.parserOptions.babelOptions) {
        config.parserOptions.babelOptions = {}
      }

      if (!config.parserOptions.babelOptions.presets) {
        config.parserOptions.babelOptions.presets = []
      }

      if (
        !config.parserOptions.babelOptions.presets.includes(
          '@babel/preset-react'
        )
      ) {
        config.parserOptions.babelOptions.presets.push('@babel/preset-react')
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

const InitReact = () => {
  requestYesOrNo(
    'Do you want to initialize js(eslint + prettier + jsconfig) with lai-cmd? '
  )
    .then((res) => res && runInitJs())
    .then(() =>
      requestYesOrNo('Do you want to initialize @babel/preset-react?').then(
        (res) =>
          res &&
          initBabelPresetReact().then(updateEslintConfigForBabelPresetReact)
      )
    )
    .then(() =>
      requestYesOrNo(
        'Do you want to initialize tailwindcss with lai-cmd?'
      ).then((res) => res && runInitReactTailwindCSS())
    )
    .then(() => {
      console.log(Text.green('All done.'))
    })
    .catch((err) => {
      console.log(`${Text.red('[ERROR]')}: ${err}`)
    })
}
module.exports = InitReact
