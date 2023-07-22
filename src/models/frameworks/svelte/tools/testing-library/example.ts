import { green } from 'kolorist';
import { Tool } from '../../../../tool';
import { Framework } from '../../../framework';
import fs from 'fs';

const install = async (framework: Framework) => {
  console.log(green('Add testing-library example'));
  const source = `import { render } from '@testing-library/svelte'
import App from './App.svelte'

test('render title', () => {
  const app = render(App)
  expect(app.getByText('Vite + Svelte'))
})
`;

  const filename = `./src/App.test.js`;
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
