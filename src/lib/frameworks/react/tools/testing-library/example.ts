import { green } from 'kolorist';
import { Tool } from '@/models/tool';
import { Framework } from '@/models/framework';
import { getDevLanguage, writeFileSyncIfNotExist } from '@/utils';
import { Tools } from '@/const/tools';

const install = async (framework: Framework) => {
  console.log(green('Add testing-library example'));

  const source = `import { render } from '@testing-library/react'
import App from './App'

test('render title', () => {
  const app = render(<App />)
  expect(app.container.innerHTML.includes("React"))
})
`;

  const devLanguage = getDevLanguage();
  const filename = `./src/App.test.${devLanguage}x`;
  writeFileSyncIfNotExist(filename, source);
};

export const Example = new Tool.Builder()
  .setInstall(install)
  .setPromptChoice({
    title: Tools.AddTestingLibraryExample,
    selected: true,
  })
  .build();
