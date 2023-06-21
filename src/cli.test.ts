import cli from './cli'
import initAction from './actions/init'
import { version } from '../package.json'
import { mockedStdout } from './test-utils'

vi.mock('./actions/init')

describe('test cli', () => {
  test('test version', async () => {
    const argv = [...process.argv, '--version']
    const stdout = mockedStdout()
    vi.spyOn(process, 'exit').mockImplementation(vi.fn())

    await cli(argv)

    expect(stdout).toHaveBeenCalledWith(`${version}\n`)
  })

  test('test init cmd', async () => {
    const argv = [...process.argv, 'init']

    await cli(argv)

    expect(initAction).toHaveBeenCalled()
  })
})
