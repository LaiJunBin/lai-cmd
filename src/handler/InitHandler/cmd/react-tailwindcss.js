const Text = require('../../../lib/Text')
const fs = require('fs')
const {
  installTailwindDependencies,
  initTailwindConfig,
  updateTailwindConfig,
} = require('./utils/tailwind')
const { handleWrapper } = require('../../../utils')

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
  return handleWrapper(
    installTailwindDependencies()
      .then(initTailwindConfig)
      .then(updateTailwindConfig)
      .then(updateIndexCSS)
  )
}
module.exports = InitReactTailwindCSS
