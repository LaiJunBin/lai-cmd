const path = require('path')
const fs = require('fs')
const yaml = require('js-yaml')

class Json2Config {
  static availables = {}
  static validates = []

  static write(file, config) {
    const ext = path.extname(file)
    const parser = (function getParser() {
      if (Json2Config.availables[ext]) {
        return Json2Config.availables[ext]
      }

      for (const validate of Json2Config.validates) {
        const action = validate(file)
        if (action) {
          return action
        }
      }
    })()

    if (!parser) {
      throw new Error(`Can't find ${ext} parser.`)
    }

    try {
      const data = parser(config)
      fs.writeFileSync(file, data)
    } catch (e) {
      throw new Error(e)
    }
  }

  static register(ext, action) {
    this.availables[ext] = action
  }

  static registerEndwith(ext, action) {
    this.validates.push((file) => {
      if (file.endsWith(ext)) {
        return action
      }
    })
  }
}

Json2Config.registerEndwith('rc', (json) => JSON.stringify(json, null, 4))
Json2Config.register('.json', (json) => JSON.stringify(json, null, 4))

Json2Config.register(
  '.js',
  (json) => `module.exports = ${JSON.stringify(json, null, 2)}`
)

Json2Config.register(
  '.cjs',
  (json) => `module.exports = ${JSON.stringify(json, null, 2)}`
)

Json2Config.register('.yml', (json) => yaml.dump(json))

module.exports = Json2Config
