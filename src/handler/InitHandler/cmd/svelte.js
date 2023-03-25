const { spawn } = require('child_process')
const Text = require('../../../lib/Text')
const {
  requestYesOrNo,
  requestPackageManager,
  checkModuleInstalled,
} = require('../../../utils')
const { requestInitEslint } = require('./utils/eslint')
const { requestInitPrettier } = require('./utils/prettier')
const fs = require('fs')
const ConfigParser = require('../../../lib/ConfigParser')
const Json2Config = require('../../../lib/JSON2Config')
const InitSvelteTailwindCSS = require('./svelte-tailwindcss')
const { requestAddRecommendationExtensionToVsCodeConfig } = require('./utils')

const requestInitSvelteTailwindCSS = () => {
  return requestYesOrNo('Do you want to initialize tailwindcss?').then(
    (res) => res && InitSvelteTailwindCSS()
  )
}

const uninstallSvelte3Plugin = async (packageManager) => {
  const packageName = 'eslint-plugin-svelte3'
  console.log(Text.green(`check ${packageName}...`))
  if (!checkModuleInstalled(packageName)) {
    console.log(Text.yellow('eslint-plugin-svelte3 is not installed, so skip.'))
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

const installSveltePlugin = async (packageManager) => {
  const packageName =
    'eslint-plugin-svelte prettier-plugin-svelte @typescript-eslint/parser'
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

const updateEslintConfig = async () => {
  console.log(Text.green('update eslint config...'))

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

      config.extends = config.extends || []
      if (typeof config.extends === 'string') {
        config.extends = [config.extends]
      }
      config.extends.push('plugin:svelte/recommended')

      if (!config.plugins) {
        config.plugins = []
      }

      const svelte3Index = config.plugins.indexOf('svelte3')
      if (svelte3Index !== -1) {
        config.plugins.splice(svelte3Index, 1)
      }

      if (!config.overrides) {
        config.overrides = []
      }

      const overrideIndex = config.overrides.findIndex((o) =>
        o.files.includes('*.svelte')
      )
      const override = config.overrides[overrideIndex]

      if (override) {
        if (override.processor === 'svelte3/svelte3') {
          delete override.processor
        }
        config.overrides[overrideIndex].parser = 'svelte-eslint-parser'
        if (!config.overrides[overrideIndex].parserOptions) {
          config.overrides[overrideIndex].parserOptions = {}
        }
        config.overrides[overrideIndex].parserOptions.parser =
          '@typescript-eslint/parser'
      } else {
        config.overrides.push({
          files: ['*.svelte'],
          parser: 'svelte-eslint-parser',
          parserOptions: {
            parser: '@typescript-eslint/parser',
          },
        })
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

const runGenerateVscodeSettings = () => {
  console.log(Text.green('generate vscode settings.json...'))
  const directory = './.vscode'
  const file = `${directory}/settings.json`
  const content = {
    'svelte.enable-ts-plugin': true,
    'editor.codeActionsOnSave': {
      'source.fixAll.eslint': true,
    },
    'eslint.validate': ['svelte'],
  }

  return new Promise((resolve, reject) => {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory)
    }
    fs.writeFile(
      file,
      JSON.stringify(content, null, 2),
      {
        flag: 'w',
      },
      (err) => {
        if (err) {
          console.log(err)
          return reject(err)
        }

        console.log(Text.green('generate vscode settings.json OK...'))
        resolve()
      }
    )
  })
}

const requestGenerateVscodeSettings = () => {
  return requestYesOrNo('Do you want to generate vscode settings.json?').then(
    (res) => res && runGenerateVscodeSettings()
  )
}

const runChangePluginOfSvelte3ToSvelte = async () => {
  const { packageManager } = await requestPackageManager()

  return uninstallSvelte3Plugin(packageManager)
    .then(() => installSveltePlugin(packageManager))
    .then(updateEslintConfig)
}

const requestChangeSvelte3ToSvelte = () => {
  return requestYesOrNo(
    'Do you want to change plugin from svelte3 to svelte?'
  ).then((res) => res && runChangePluginOfSvelte3ToSvelte())
}

const InitSvelte = () => {
  return requestInitEslint()
    .then(requestChangeSvelte3ToSvelte)
    .then(requestInitPrettier)
    .then(requestInitSvelteTailwindCSS)
    .then(requestGenerateVscodeSettings)
    .then(() =>
      requestAddRecommendationExtensionToVsCodeConfig(['svelte.svelte-vscode'])
    )
}
module.exports = InitSvelte
