import 'dotenv/config'
import inquirer from 'inquirer'

import { LANGUAGE, LOCIZE_APP, UI_VERSION } from './constant.js'
import {
  getLocizeTranslations,
  getTranslationFromFile,
  publishLocizeTranslations,
  updateLocizeTranslations,
} from './utils.js'

const questions = [
  {
    type: 'list',
    name: 'locizeApp',
    message: 'Which repo you want to add translations?',
    choices: [
      {
        name: 'UI',
        value: 'ui',
      },
      {
        name: 'Cami-forms',
        value: 'cami-forms',
      },
    ],
  },
  {
    type: 'checkbox',
    name: 'versions',
    message: 'Versions?',
    choices: [
      {
        name: 'Qa2',
        value: 'qa2',
      },
      {
        name: 'Caf-psr',
        value: 'caf-psr',
      },
      {
        name: 'Staging',
        value: 'staging',
      },
      {
        name: 'Production',
        value: 'production',
      },
    ],
    when(answers) {
      return answers.locizeApp === 'ui'
    },
  },
  {
    type: 'input',
    name: 'appName',
    message: 'Which app you want to add translations?',
  },
]

export const addTranslations = async () => {
  try {
    const {
      locizeApp,
      versions = ['latest'],
      appName,
    } = await inquirer.prompt(questions)

    const { uiTranslations, camiFormsTranslations } =
      await getTranslationFromFile(appName)

    let en, ja
    if (locizeApp === LOCIZE_APP.UI) {
      en = uiTranslations.en
      ja = uiTranslations.ja
    } else {
      en = camiFormsTranslations.en
      ja = camiFormsTranslations.ja
    }

    for (const version of versions) {
      console.log(`👉 Checking version ${version}... \n`)

      if (en) {
        const allEnTranslations = await getLocizeTranslations({
          locizeApp,
          language: LANGUAGE.EN,
          version,
        })

        for (const key in en) {
          if (allEnTranslations[key]) {
            console.log(
              `⛔️ Key "${key}" is already exist with value "${allEnTranslations[key]}"`
            )
          } else {
            const josysUIParams = {
              locizeApp,
              version,
              language: LANGUAGE.EN,
              body: en,
            }
            await updateLocizeTranslations(josysUIParams)
          }
        }
      }

      if (ja) {
        const allJaTranslations = await getLocizeTranslations({
          locizeApp,
          language: LANGUAGE.JP,
          version,
        })

        for (const key in ja) {
          if (allJaTranslations[key]) {
            console.log(
              `⛔️ Key "${key}" is already exist with value "${allJaTranslations[key]}"`
            )
          } else {
            const josysUIParams = {
              locizeApp,
              version,
              language: LANGUAGE.JP,
              body: ja,
            }
            await updateLocizeTranslations(josysUIParams)
          }
        }
      }

      if (version !== UI_VERSION.QA2) {
        await publishLocizeTranslations({ locizeApp, version })
      }

      console.log(
        `✅ Add translations version ${version} for ${locizeApp}: DONE ✅ \n`
      )
    }
  } catch (error) {
    console.log(`⛔️ Fail to add translations!`)
  }
}
