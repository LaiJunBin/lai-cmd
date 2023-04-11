const Text = require('../../../lib/Text')
const fs = require('fs')
const {
  installTailwindDependencies,
  initTailwindConfig,
  updateTailwindConfig,
  requestAddTailwindRecommendationExtensions,
  installPrettierPluginTailwindcss,
} = require('./utils/tailwind')
const prompts = require('prompts')
const { requestYesOrNo } = require('../../../utils')
const ConfigParser = require('../../../lib/ConfigParser')
const Json2Config = require('../../../lib/JSON2Config')

const updateIndexCSS = async () => {
  const defaultCssPath = './src/index.css'
  const result = await prompts({
    type: 'text',
    name: 'cssPath',
    message: 'Please input index.css path',
    initial: defaultCssPath,
  })

  let cssPath = result.cssPath
  if (!fs.existsSync(cssPath)) {
    console.log(Text.yellow(`${cssPath} not exists, create it.`))
    cssPath = defaultCssPath
    fs.writeFileSync(cssPath, '')
  }

  console.log(Text.green(`update ${cssPath}...`))

  return new Promise((resolve, reject) => {
    try {
      const file = cssPath
      const data = `@tailwind base;
@tailwind components;
@tailwind utilities;

${fs.readFileSync(file).toString()}
`

      fs.writeFileSync(file, data)

      console.log(Text.green(`update ${cssPath} OK...`))
      console.log(Text.yellow(`remember to import ${cssPath} when you use.`))
      resolve()
    } catch (e) {
      console.log(e)
      return reject(e)
    }
  })
}

const updatePrettierConfig = async () => {
  try {
    console.log(Text.green('update prettier config...'))
    const dirs = fs.readdirSync('./')
    const configs = dirs
      .filter((dir) => /^\.prettier/.test(dir))
      .filter((file) => !file.endsWith('ignore'))

    if (configs.length === 0) {
      throw new Error(`can't find prettier config file.`)
    }

    if (configs.length > 1) {
      throw new Error('Uncertain the prettier config file.')
    }

    const configFile = configs[0]
    const config = ConfigParser.parse(configFile)

    if (!config.plugins) {
      config.plugins = []
    }

    if (config.plugins.includes('prettier-plugin-svelte')) {
      config.plugins = config.plugins.filter(
        (plugin) => plugin !== 'prettier-plugin-svelte'
      )
    }

    Json2Config.write(configFile, config)
    console.log(Text.green('update prettier config OK...'))
  } catch {
    console.log(Text.red('update prettier config failed...'))
    console.log(Text.yellow('please update it manually.'))
    console.log(Text.yellow('remove prettier-plugin-svelte from plugins'))
    console.log(
      Text.yellow(
        `{
  "plugins": ["prettier-plugin-svelte"]  // <-- remove it
}`
      )
    )
  }
}

const requestInstallPrettierPluginTailwindcss = async () => {
  if (
    !(await requestYesOrNo(
      'Would you like to install prettier-plugin-tailwindcss?'
    ))
  ) {
    return
  }

  return installPrettierPluginTailwindcss().then(updatePrettierConfig)
}

const InitSvelteTailwindCSS = () => {
  return installTailwindDependencies()
    .then(initTailwindConfig)
    .then(updateTailwindConfig)
    .then(updateIndexCSS)
    .then(requestInstallPrettierPluginTailwindcss)
    .then(requestAddTailwindRecommendationExtensions)
}
module.exports = InitSvelteTailwindCSS
