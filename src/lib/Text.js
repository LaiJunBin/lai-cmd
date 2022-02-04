const Colors = require('../const/Colors')
const RESET = '\x1b[0m'

const Text = {
  while(text) {},
  green(text) {},
  red(text) {},
  yellow(text) {},
}

for (const key in Text) {
  const prefix = Colors[key.toUpperCase()]
  Text[key] = (text) => prefix + text + RESET
}

module.exports = Text
