import { Svelte } from './svelte';
import { Vue } from './vue';
import { React } from './react';
import { Others } from './others';
import { Framework } from '@/models/framework';
import { SvelteKit } from './sveltekit/sveltekit';

Framework.register('Vue', Vue);
Framework.register('React', React);
Framework.register('Svelte', Svelte);
Framework.register('SvelteKit', SvelteKit);
Framework.register('None of the above', Others);

export { Framework };
