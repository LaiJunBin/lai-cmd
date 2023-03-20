import fs from 'fs'
import { spawn } from 'child_process'
import ConfigParser from '../../../../lib/ConfigParser'
import Json2Config from '../../../../lib/JSON2Config'
import Text from '../../../../lib/Text'
import { requestYesOrNo } from '../../../../utils'

export const installTailwindDependencies = async () => {
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

export const initTailwindConfig = () => {
  console.log(Text.green('Init tailwindcss config.'))

  return new Promise((resolve, reject) => {
    const shell = spawn('npx', ['tailwindcss', 'init', '-p'], {
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

export const updateTailwindConfig = () => {
  console.log(Text.green('update tailwind config...'))

  return new Promise((resolve, reject) => {
    try {
      let configFile = 'tailwind.config.js'
      if (!fs.existsSync(configFile)) {
        configFile = 'tailwind.config.cjs'
      }

      const config = ConfigParser.parse(configFile)
      const contents = ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}']

      config.content = config.content || []

      for (const content of contents) {
        if (!config.content.includes(content)) {
          config.content.push(content)
        }
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
