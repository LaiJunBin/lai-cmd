const path = require('path')
const fs = require('fs')
const yaml = require('js-yaml')

class ConfigParser {
  static availables = {}

  static parse(file) {
    const ext = path.extname(file)
    const parser = ConfigParser.availables[ext]
    if (!parser) {
      throw new Error(`Can't find ${ext} parser.`)
    }

    try {
      return parser(file)
    } catch (e) {
      throw new Error(`Can't parser file: ${file}\n${e}`)
    }
  }

  static register(ext, action) {
    this.availables[ext] = action
  }
}

ConfigParser.register('.json', (file) =>
  JSON.parse(fs.readFileSync(file).toString())
)
// eslint-disable-next-line no-eval
ConfigParser.register('.js', (file) => eval(fs.readFileSync(file).toString()))

ConfigParser.register('.yml', (file) =>
  yaml.load(fs.readFileSync(file).toString())
)

module.exports = ConfigParser
