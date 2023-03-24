const Handler = require('../')
const InitJs = require('./cmd/js')
const InitReact = require('./cmd/react')
const InitReactTailwindCSS = require('./cmd/react-tailwindcss')
const InitSvelte = require('./cmd/svelte')
const InitSvelteTailwindCSS = require('./cmd/svelte-tailwindcss')
const InitVue = require('./cmd/vue')
const InitVueTailwindCSS = require('./cmd/vue-tailwindcss')

class InitHandler extends Handler {}

InitHandler.register('js', InitJs)
InitHandler.register('react-tailwindcss', InitReactTailwindCSS)
InitHandler.register('react', InitReact)
InitHandler.register('vue', InitVue)
InitHandler.register('vue-tailwindcss', InitVueTailwindCSS)
InitHandler.register('svelte', InitSvelte)
InitHandler.register('svelte-tailwindcss', InitSvelteTailwindCSS)

module.exports = InitHandler
