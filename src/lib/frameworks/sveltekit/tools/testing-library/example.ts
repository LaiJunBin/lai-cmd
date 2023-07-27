import { green } from 'kolorist';
import { Tool } from '@/models/tool';
import { Framework } from '@/models/framework';
import { getDevLanguage, writeFileSyncIfNotExist } from '@/utils';
import { Tools } from '@/const/tools';

const install = async (framework: Framework) => {
  console.log(green('Add testing-library example'));
  const source = `import { render } from '@testing-library/svelte'
import Page from './+page.svelte'

test('render title', () => {
  const page = render(Page)
  expect(page.getByText('Welcome to SvelteKit'))
})
`;

  const devLanguage = getDevLanguage();
  const filename = `./src/routes/page.test.${devLanguage}`;
  writeFileSyncIfNotExist(filename, source);
};

export const Example = new Tool.Builder()
  .setInstall(install)
  .setPromptChoice({
    title: Tools.AddTestingLibraryExample,
    selected: true,
  })
  .build();
