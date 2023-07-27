import { Svelte } from './svelte';
import { Vue } from './vue';
import { React } from './react';
import { Others } from './others';
import { Framework } from '@/models/framework';

Framework.register('Vue', Vue);
Framework.register('React', React);
Framework.register('Svelte', Svelte);
Framework.register('None of the above', Others);

export { Framework };
