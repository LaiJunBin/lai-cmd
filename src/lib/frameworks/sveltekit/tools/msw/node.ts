import { createNodeTool } from '@/lib/common-tools/msw/node';
import { getDevLanguage } from '@/utils';

const extension = getDevLanguage();
const filename = `./src/hooks.server.${extension}`;
export const Node = createNodeTool(filename);
