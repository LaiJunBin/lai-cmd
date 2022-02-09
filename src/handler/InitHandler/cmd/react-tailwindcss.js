const { spawn } = require('child_process')
const Text = require('../../../lib/Text')
const promptly = require('promptly')
const ConfigParser = require('../../../lib/ConfigParser')
const Json2Config = require('../../../lib/JSON2Config')
const fs = require('fs')

const initConfig = () => {
  console.log(Text.green('Init tailwindcss config.'))

  return new Promise((resolve, reject) => {
    const shell = spawn('npx', ['tailwindcss', 'init'], {
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

const installDependencies = async () => {
  console.log(`The ${Text.green('requires')} the following dependencies: `)
  console.log('tailwindcss postcss autoprefixer')
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
      ['i', '-D', 'tailwindcss', 'postcss', 'autoprefixer'],
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

      console.log(Text.green('dependencies installed.'))
      resolve()
    })
  })
}

const updateConfig = () => {
  console.log(Text.green('update tailwind config...'))

  return new Promise((resolve, reject) => {
    try {
      const configFile = 'tailwind.config.js'
      const config = ConfigParser.parse(configFile)

      config.content = config.content || []

      if (!config.content.includes('./src/**/*.{js,jsx,ts,tsx}')) {
        config.content.push('./src/**/*.{js,jsx,ts,tsx}')
      }

      Json2Config.write(configFile, config)
      console.log(Text.green('update tailwind config OK...'))
      resolve()
    } catch (e) {
      console.log(e)
      return reject(e)
    }
  })
}

const updateIndexCSS = () => {
  console.log(Text.green('update index.css...'))

  return new Promise((resolve, reject) => {
    try {
      const file = './src/index.css'
      const data = `@tailwind base;
@tailwind components;
@tailwind utilities;

${fs.readFileSync(file).toString()}
`

      fs.writeFileSync(file, data)

      console.log(Text.green('update index.css OK...'))
      resolve()
    } catch (e) {
      console.log(e)
      return reject(e)
    }
  })
}

const InitReactTailwindCSS = () => {
  installDependencies()
    .then(initConfig)
    .then(updateConfig)
    .then(updateIndexCSS)
    .then(() => {
      console.log(Text.green('All done.'))
    })
    .catch((err) => {
      console.log(`${Text.red('[ERROR]')}: ${err}`)
    })
}
module.exports = InitReactTailwindCSS
