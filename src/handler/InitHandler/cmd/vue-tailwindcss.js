const Text = require('../../../lib/Text')
const fs = require('fs')
const {
  installTailwindDependencies,
  initTailwindConfig,
  updateTailwindConfig,
} = require('./utils/tailwind')

const updateBaseCSS = () => {
  console.log(Text.green('update css...'))

  return new Promise((resolve, reject) => {
    try {
      const file = (() => {
        if (fs.existsSync('./src/assets/base.css')) {
          return './src/assets/base.css'
        }

        return './src/assets/main.css'
      })()

      const content = (() => {
        if (fs.existsSync(file)) {
          return fs.readFileSync(file).toString()
        }

        return ''
      })()
      if (content.includes('@tailwind')) {
        console.log(
          Text.green('css file not changed(already exists @tailwind config).')
        )
        return resolve()
      }

      const data = `@tailwind base;
@tailwind components;
@tailwind utilities;

${content}
`

      fs.writeFileSync(file, data)

      console.log(Text.green(`update ${file} OK...`))
      resolve()
    } catch (e) {
      console.log(e)
      return reject(e)
    }
  })
}

const InitVueTailwindCSS = () => {
  return installTailwindDependencies()
    .then(initTailwindConfig)
    .then(updateTailwindConfig)
    .then(updateBaseCSS)
}
module.exports = InitVueTailwindCSS
