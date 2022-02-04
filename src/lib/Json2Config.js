const path = require('path')
const fs = require('fs')
const yaml = require('js-yaml')

class Json2Config {
  static availables = {}

  static write(file, config) {
    const ext = path.extname(file)
    const parser = Json2Config.availables[ext]
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
}

Json2Config.register('.json', (json) => JSON.stringify(json, null, 4))

Json2Config.register(
  '.js',
  (json) => `module.exports = ${JSON.stringify(json, null, 2)}`
)

Json2Config.register('.yml', (json) => yaml.dump(json))

module.exports = Json2Config
