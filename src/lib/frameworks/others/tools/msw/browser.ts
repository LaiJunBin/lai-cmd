import { getDevLanguage } from '@/utils';
import { createBrowserTool } from '@/lib/common-tools/msw/browser';

const extension = getDevLanguage();
let filename = `./src/main.${extension}`;
if (extension === 'js') {
  filename = `./main.${extension}`;
} else if (extension === 'ts') {
  filename = `./src/main.${extension}`;
}

export const Browser = createBrowserTool('./public', filename);
