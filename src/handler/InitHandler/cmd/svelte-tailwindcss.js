const Text = require('../../../lib/Text')
const fs = require('fs')
const {
  installTailwindDependencies,
  initTailwindConfig,
  updateTailwindConfig,
  requestAddTailwindRecommendationExtensions,
} = require('./utils/tailwind')
const prompts = require('prompts')

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

const InitSvelteTailwindCSS = () => {
  return installTailwindDependencies()
    .then(initTailwindConfig)
    .then(updateTailwindConfig)
    .then(updateIndexCSS)
    .then(requestAddTailwindRecommendationExtensions)
}
module.exports = InitSvelteTailwindCSS
