import { Svelte } from './svelte/svelte';
import { Vue } from './vue/vue';
import { React } from './react/react';
import { Others } from './others/others';
import { Framework } from './framework';

Framework.register('Vue', Vue);
Framework.register('React', React);
Framework.register('Svelte', Svelte);
Framework.register('None of the above', Others);

export { Framework };
