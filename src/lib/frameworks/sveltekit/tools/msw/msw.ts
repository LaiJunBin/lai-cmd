import { MSWX } from './mswx';
import { Browser } from './browser';
import { Node } from './node';
import { createMSWTool } from '@/lib/common-tools/msw/msw';

export const MSW = createMSWTool([Browser, Node, MSWX]);
