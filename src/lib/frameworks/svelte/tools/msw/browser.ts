import { getDevLanguage } from '@/utils';
import { createBrowserTool } from '@/lib/common-tools/msw/browser';

const extension = getDevLanguage();
const filename = `./src/main.${extension}`;

export const Browser = createBrowserTool(filename);
