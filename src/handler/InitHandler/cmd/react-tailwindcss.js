const { spawn } = require('child_process')
const Text = require('../../../lib/Text')
const ConfigParser = require('../../../lib/ConfigParser')
const Json2Config = require('../../../lib/JSON2Config')
const fs = require('fs')
const { requestYesOrNo } = require('../../../utils')

const initConfig = () => {
  console.log(Text.green('Init tailwindcss config.'))

  return new Promise((resolve, reject) => {
    const shell = spawn('npx', ['tailwindcss', 'init'], {
      stdio: 'inherit',
      shell: true,
    })

    shell.on('close', (code) => {
      if (code !== 0) {
        const error = `${Text.red(
          'ERROR'
        )}: [init tailwind config] terminated code: ${code}`
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
        )}: [install tailwind] terminated code: ${code}`
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
