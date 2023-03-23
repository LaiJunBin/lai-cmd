const Text = require('../../../lib/Text')
const fs = require('fs')
const ConfigParser = require('../../../lib/ConfigParser')
const Json2Config = require('../../../lib/JSON2Config')
const { requestYesOrNo } = require('../../../utils')
const InitVueTailwindCSS = require('./vue-tailwindcss')
const { initEslint } = require('./utils/eslint')
const {
  initPrettier,
  generatePrettierConfig,
  updateEslintConfigForPrettier,
} = require('./utils/prettier')

const updateEslintConfigForVue3 = async () => {
  console.log(Text.green('update eslint config for vue3 recommended'))

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

      config.extends[0] = 'plugin:vue/vue3-recommended'

      Json2Config.write(configFile, config)
      console.log(Text.green('update eslint config OK...'))
      resolve()
    } catch (e) {
      console.log(e)
      return reject(e)
    }
  })
}

const InitVue = () => {
  requestYesOrNo('Do you want to initialize eslint?')
    .then((res) => res && initEslint())
    .then(updateEslintConfigForVue3)
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
      requestYesOrNo(
        'Do you want to initialize tailwindcss with lai-cmd?'
      ).then((res) => res && InitVueTailwindCSS())
    )
    .then(() => {
      console.log(Text.green('All done.'))
    })
    .catch((err) => {
      console.log(`${Text.red('[ERROR]')}: ${err}`)
    })
}
module.exports = InitVue
