const promptly = require('promptly')

export const requestYesOrNo = async (message, defaultYes = true) => {
  return (
    (
      await promptly.prompt(`${message} (${defaultYes ? 'y' : 'n'})`, {
        default: defaultYes ? 'y' : 'n',
      })
    ).toLowerCase() !== 'n'
  )
}
