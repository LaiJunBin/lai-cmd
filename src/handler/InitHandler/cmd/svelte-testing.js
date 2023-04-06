const { spawn } = require('child_process')
const Text = require('../../../lib/Text')
const fs = require('fs')
const ConfigParser = require('../../../lib/ConfigParser')
const { requestPackageManager, requestYesOrNo } = require('../../../utils')
const Json2Config = require('../../../lib/JSON2Config')

const installTestingDependencies = async () => {
  console.log(`The ${Text.green('requires')} the following dependencies: `)
  console.log('vitest @testing-library/svelte jsdom')

  if (!(await requestYesOrNo('Would you like to install them now?'))) {
    console.log(
      `${Text.yellow(
        '[WARNING]'
      )}: generate the config file first, please don't forget to install the dependencies.`
    )
    return
  }
  const { packageManager, args } = await requestPackageManager()
  args.push('vitest', '@testing-library/svelte', 'jsdom')

  return new Promise((resolve, reject) => {
    const shell = spawn(packageManager, args, {
      stdio: 'inherit',
      shell: true,
    })

    shell.on('close', (code) => {
      if (code !== 0) {
        const error = `${Text.red(
          'ERROR'
        )}: [install testing] terminated code: ${code}`
        console.log(error)
        return reject(error)
      }

      console.log(Text.green('dependencies installed.'))
      resolve()
    })
  })
}

const updateViteConfig = async () => {
  console.log(Text.green('update vite config...'))
  // todo: parse vite config automatically
  console.log(Text.yellow('please update vite config manually.'))
  const config = `test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    environment: 'jsdom',
    globals: true
}`

  console.log(Text.yellow('add this config to vite.config.{js|ts}:'))
  console.log(Text.yellow(config))
}

const updateScriptConfig = async () => {
  const jsConfigPath = './jsconfig.json'
  const tsConfigPath = './tsconfig.json'
  const configFile = fs.existsSync(jsConfigPath) ? jsConfigPath : tsConfigPath

  if (!fs.existsSync(configFile)) {
    console.log(Text.yellow(`${configFile} not exists, create it.`))
    fs.writeFileSync(configFile, '{}')
  }

  console.log(Text.green(`update ${configFile}...`))
  let config
  try {
    config = ConfigParser.parse(configFile)
  } catch {
    console.log(Text.yellow(`parse ${configFile} failed.`))
    if (
      await requestYesOrNo(
        `Would you like to force parse it? (comments will be removed)`
      )
    ) {
      const syntax = fs.readFileSync(configFile).toString()
      try {
        // eslint-disable-next-line no-eval
        eval(`config = ${syntax}`)
        console.log(Text.green(`force parse ${configFile} success.`))
      } catch {
        console.log(
          Text.red(`parse ${configFile} failed, please update it manually.`)
        )
        console.log(Text.yellow(`add this config to ${configFile}:`))
        console.log(Text.yellow(`  "compilerOptions": {`))
        console.log(Text.yellow(`    "types": ["vitest/globals"]`))
        console.log(Text.yellow(`  }`))
        return
      }
    } else {
      console.log(Text.yellow('please update it manually.'))
      console.log(Text.yellow(`add this config to ${configFile}:`))
      console.log(Text.yellow(`  "compilerOptions": {`))
      console.log(Text.yellow(`    "types": ["vitest/globals"]`))
      console.log(Text.yellow(`  }`))
      return
    }
  }
  config.compilerOptions = config.compilerOptions || {}
  config.compilerOptions.types = config.compilerOptions.types || []
  if (!config.compilerOptions.types.includes('vitest/globals')) {
    config.compilerOptions.types.push('vitest/globals')
  }

  Json2Config.write(configFile, config)
  console.log(Text.green(`update ${configFile} success.`))
}

const addScriptToPackageJson = async () => {
  console.log(Text.green(`set test:unit command to package.json...`))
  return new Promise((resolve, reject) => {
    const cmd = `npm pkg set scripts.test:unit=vitest`
    const shell = spawn(cmd, {
      stdio: 'inherit',
      shell: true,
    })

    shell.on('close', (code) => {
      if (code !== 0) {
        console.log(
          Text.yellow('please set test:unit command to package.json manually.')
        )
        console.log(Text.yellow('example: '))
        console.log(Text.yellow('  "scripts": {'))
        console.log(Text.yellow('    "test:unit": "vitest"'))
        console.log(Text.yellow('  }'))
        const error = `${Text.red(
          'ERROR'
        )}: [set test:unit command to package.json] terminated code: ${code}`
        return reject(error)
      }

      console.log(Text.green('set test:unit command to package.json success.'))
      resolve()
    })
  })
}

const InitSvelteTesting = () => {
  return installTestingDependencies()
    .then(updateScriptConfig)
    .then(updateViteConfig)
    .then(addScriptToPackageJson)
}
module.exports = InitSvelteTesting
