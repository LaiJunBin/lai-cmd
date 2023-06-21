import { program } from 'commander'
import initAction from './actions/init'
import { version } from '../package.json'

const cli = async (argv: string[]) => {
  program.version(version)
  program.command('init').description('init a project').action(initAction)

  return program.parse(argv)
}

export default cli
