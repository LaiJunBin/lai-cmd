require('regenerator-runtime/runtime')
const { program } = require('commander')
const InitHandler = require('./handler/InitHandler')

const run = () => {
  program
    .command('init')
    .description('init source')
    .argument('<source>', 'init source')
    .action((source, options, command) =>
      new InitHandler(source, options, command).execute()
    )

  program.parse(process.argv)
}

module.exports = { run }
