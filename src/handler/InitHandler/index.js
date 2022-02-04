const Handler = require('../')
const InitJs = require('./cmd/js')
const InitReactTailwindCSS = require('./cmd/react-tailwindcss')

class InitHandler extends Handler {}

InitHandler.register('js', InitJs)
InitHandler.register('react-tailwindcss', InitReactTailwindCSS)

module.exports = InitHandler
