import prompts from 'prompts'

const initAction = async () => {
  const response = await prompts({
    type: 'select',
    name: 'projectType',
    message: 'Select init project type',
    choices: [
      { title: 'JavaScript', value: 'js' },
      { title: 'TypeScript', value: 'ts' },
      { title: 'Vue3', value: 'vue3' },
      { title: 'React', value: 'react' },
      { title: 'Svelte', value: 'svelte' },
    ],
    initial: 0,
  })

  const { projectType } = response
  process.stdout.write(`You selected ${projectType}\n`)
}

export default initAction
