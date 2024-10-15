import 'dotenv/config'
import {
  CAMI_FORMS_VERSION,
  LANGUAGE,
  LOCIZE_APP,
  UI_VERSION,
} from './constant.js'
import { getLocizeTranslations, getTranslationFromFile } from './utils.js'
import inquirer from 'inquirer'

const questions = [
  {
    type: 'list',
    name: 'locizeApp',
    message: 'Which repo you want to check translations?',
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
    type: 'list',
    name: 'option',
    message: 'Which option you want to check?',
    choices: [
      {
        name: 'Check by json file in folder /translations',
        value: 'file',
      },
      {
        name: 'Grep by app name for keys which are already on qa2 then check if those keys are on staging or production',
        value: 'qa2',
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
    when(answers) {
      return answers.locizeApp === 'cami-forms' || answers.option === 'file'
    },
  },
  {
    type: 'input',
    name: 'appName',
    message: 'Enter the keyword to grep',
    when(answers) {
      return answers.option === 'qa2'
    },
  },
]

const checkTranslationsByVersion = async ({
  locizeApp,
  translation,
  version,
}) => {
  const { en, ja } = translation
  const enLocize = await getLocizeTranslations({
    locizeApp,
    version,
    language: LANGUAGE.EN,
  })
  const jaLocize = await getLocizeTranslations({
    locizeApp,
    version,
    language: LANGUAGE.JP,
  })

  const enMissingKeys = []
  const jaMissingKeys = []

  for (const [key, value] of Object.entries(en)) {
    if (!enLocize[key]) {
      enMissingKeys.push(` "${key}": "${value}"`)
    }
  }
  for (const [key, value] of Object.entries(ja)) {
    if (!jaLocize[key]) {
      jaMissingKeys.push(` "${key}": "${value}"`)
    }
  }

  if (enMissingKeys.length > 0 || jaMissingKeys.length > 0) {
    console.log(`👉 ${version}: Missing keys ⛔️`)
    enMissingKeys.forEach((e, i) => {
      i === 0 && console.log(` "en": \n  {`)
      console.log(`   ${e}${i !== enMissingKeys.length - 1 ? ',' : '\n  },'}`)
    })
    jaMissingKeys.forEach((e, i) => {
      i === 0 && console.log(' "ja": \n  {')
      console.log(`   ${e}${i !== jaMissingKeys.length - 1 ? ',' : '\n  }\n'}`)
    })
  } else {
    console.log(`👉 ${version}: DONE ✅ \n`)
  }
}

export const checkTranslations = async () => {
  try {
    const { locizeApp, option, appName } = await inquirer.prompt(questions)
    const isCheckingWithQa2 =
      locizeApp === LOCIZE_APP.UI && option === UI_VERSION.QA2

    if (isCheckingWithQa2) {
      // Download translation version qa2, grep by app name for keys, check those keys on other envs (staging, prod)
      const filterQa2En = {}
      const filterQa2Ja = {}
      const qa2TranslationsEn = await getLocizeTranslations({
        locizeApp: LOCIZE_APP.UI,
        version: UI_VERSION.QA2,
        language: LANGUAGE.EN,
      })
      for (const [key, value] of Object.entries(qa2TranslationsEn)) {
        if (key.includes(appName)) {
          filterQa2En[key] = value
        }
      }
      const qa2TranslationsJa = await getLocizeTranslations({
        locizeApp: LOCIZE_APP.UI,
        version: UI_VERSION.QA2,
        language: LANGUAGE.JP,
      })
      for (const [key, value] of Object.entries(qa2TranslationsJa)) {
        if (key.includes(appName)) {
          filterQa2Ja[key] = value
        }
      }

      for (const version of ['latest', 'staging', 'production']) {
        await checkTranslationsByVersion({
          locizeApp,
          translation: { en: filterQa2En, ja: filterQa2Ja },
          version,
        })
      }
    } else {
      const { uiTranslations, camiFormsTranslations } =
        await getTranslationFromFile(appName)
      const translation =
        locizeApp === LOCIZE_APP.UI ? uiTranslations : camiFormsTranslations
      const versions =
        locizeApp === LOCIZE_APP.UI
          ? Object.values(UI_VERSION)
          : Object.values(CAMI_FORMS_VERSION)

      for (const version of versions) {
        await checkTranslationsByVersion({ locizeApp, translation, version })
      }
    }
  } catch (error) {
    console.log(`⛔️ Fail to check missing translations!`, error)
  }
}
