const Handler = require('../')
const InitJs = require('./cmd/js')
const InitReact = require('./cmd/react')
const InitReactTailwindCSS = require('./cmd/react-tailwindcss')

class InitHandler extends Handler {}

InitHandler.register('js', InitJs)
InitHandler.register('react-tailwindcss', InitReactTailwindCSS)
InitHandler.register('react', InitReact)

module.exports = InitHandler
