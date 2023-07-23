import { green } from 'kolorist';
import { Tool } from '../../../../tool';
import { Framework } from '../../../framework';
import fs from 'fs';
import { getDevLanguage } from '../../../../../utils';

const install = async (framework: Framework) => {
  console.log(green('Add testing-library example'));
  const source = `import { render } from '@testing-library/svelte'
import App from './App.svelte'

test('render title', () => {
  const app = render(App)
  expect(app.getByText('Vite + Svelte'))
})
`;

  const devLanguage = await getDevLanguage();
  const filename = `./src/App.test.${devLanguage}`;
  if (fs.existsSync(filename)) {
    console.log(green(`${filename} already exists, skip`));
    return;
  }

  fs.writeFileSync(filename, source);
  console.log(green(`Create ${filename} successfully`));
};

export const Example = new Tool.Builder()
  .setInstall(install)
  .setPromptChoice({
    title: 'Add Testing-Library Example',
    selected: true,
  })
  .build();
