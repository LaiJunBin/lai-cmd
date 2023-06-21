import prompts from 'prompts';
import { initAction } from '.';
import { mockedStdout } from '../../test-utils';

describe('test init cmd', () => {
  test('test select project type', async () => {
    const stdout = mockedStdout();

    prompts.inject(['ts']);
    await initAction();

    expect(stdout).toHaveBeenCalledWith('You selected ts\n');
  });
});
