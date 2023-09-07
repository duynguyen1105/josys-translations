import 'dotenv/config'
import inquirer from 'inquirer'

import { LANGUAGE, LOCIZE_APP, UI_VERSION } from './constant.js'
import {
  getTranslationFromFile,
  publishLocizeTranslations,
  updateLocizeTranslations,
} from './utils.js'

const questions = [
  {
    type: 'list',
    name: 'locizeApp',
    message: 'Which repo you want to update translations?',
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

export const updateTranslations = async () => {
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
      console.log(`👉 Updating version ${version}... \n`)

      if (en) {
        for (const key in en) {
          const josysUIParams = {
            locizeApp,
            version,
            language: LANGUAGE.EN,
            body: en,
          }
          await updateLocizeTranslations(josysUIParams)
        }
      }

      if (ja) {
        for (const key in ja) {
          const josysUIParams = {
            locizeApp,
            version,
            language: LANGUAGE.JP,
            body: ja,
          }
          await updateLocizeTranslations(josysUIParams)
        }
      }

      if (version !== UI_VERSION.QA2) {
        await publishLocizeTranslations({ locizeApp, version })
      }

      console.log(
        `✅ Update translations version ${version} for ${locizeApp}: DONE ✅ \n`
      )
    }
  } catch (error) {
    console.log(`⛔️ Fail to update translations!`)
  }
}
