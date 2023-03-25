import Text from '../../../../lib/Text'
import { spawn } from 'child_process'
import { requestYesOrNo } from '../../../../utils'
import fs from 'fs'

const runInitJs = () => {
  return new Promise((resolve, reject) => {
    const shell = spawn('npx', ['lai-cmd', 'init', 'js'], {
      stdio: 'inherit',
      shell: true,
    })

    shell.on('close', (code) => {
      if (code !== 0) {
        const error = `${Text.red('ERROR')}: [init js] terminated code: ${code}`
        console.log(error)
        return reject(error)
      }

      resolve()
    })
  })
}

export const requestRunInitJs = () => {
  return requestYesOrNo(
    'Do you want to initialize js(eslint + prettier + jsconfig) with lai-cmd? '
  ).then((res) => res && runInitJs())
}

const addRecommendationExtensionToVsCodeConfig = (extensions = []) => {
  console.log(
    Text.green(`add ${extensions.join(', ')} extension to extensions.json...`)
  )
  const directory = './.vscode'
  const file = `${directory}/extensions.json`

  const fileContent = {
    recommendations: extensions,
  }

  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8').toString()
    const json = JSON.parse(content)
    if (json.recommendations) {
      fileContent.recommendations = [
        ...new Set(json.recommendations.concat(extensions)),
      ]
    }
  }

  return new Promise((resolve, reject) => {
    if (!fs.existsSync(directory)) {
      console.log(Text.green(`create directory ${directory}...`))
      fs.mkdirSync(directory)
      console.log(Text.green(`create directory ${directory} OK...`))
    }
    fs.writeFile(
      file,
      JSON.stringify(fileContent, null, 2),
      {
        flag: 'w',
      },
      (err) => {
        if (err) {
          console.log(err)
          return reject(err)
        }

        console.log(
          Text.green(`add ${extensions.join(', ')} extensions.json OK...`)
        )
        resolve()
      }
    )
  })
}

export const requestAddRecommendationExtensionToVsCodeConfig = (
  extensions = []
) => {
  return requestYesOrNo(
    `Do you want to add extensions(${extensions.join(
      ', '
    )}) to extensions.json?`
  ).then((res) => res && addRecommendationExtensionToVsCodeConfig(extensions))
}
