import fetch from 'node-fetch'
import {
  LOCIZE_APP,
  CAMI_FORMS_ID,
  CAMI_FORMS_NAMESPACE,
  CAMI_FORMS_TOKEN,
  ENDPOINT,
  UI_ID,
  UI_NAMESPACE,
  UI_TOKEN,
} from './constant.js'

const getAllTranslationsUrl = ({ locizeApp, version, language }) => {
  const id = locizeApp === LOCIZE_APP.UI ? UI_ID : CAMI_FORMS_ID
  const namespace =
    locizeApp === LOCIZE_APP.UI ? UI_NAMESPACE : CAMI_FORMS_NAMESPACE
  return `${ENDPOINT}/${id}/${version}/${language}/${namespace}`
}

const updateTranslationsUrl = ({ locizeApp, version, language }) => {
  const id = locizeApp === LOCIZE_APP.UI ? UI_ID : CAMI_FORMS_ID
  const namespace =
    locizeApp === LOCIZE_APP.UI ? UI_NAMESPACE : CAMI_FORMS_NAMESPACE
  return `${ENDPOINT}/update/${id}/${version}/${language}/${namespace}`
}

const publishTranslationsUrl = ({ locizeApp, version }) => {
  const id = locizeApp === LOCIZE_APP.UI ? UI_ID : CAMI_FORMS_ID
  return `${ENDPOINT}/publish/${id}/${version}`
}

export const getTranslationFromFile = async (appName) => {
  try {
    const { default: translations } = await import(
      `./translations/${appName}.json`,
      {
        assert: { type: 'json' },
      }
    )

    const uiTranslations = { en: {}, ja: {} }
    const camiFormsTranslations = { en: {}, ja: {} }

    Object.entries(translations.en).forEach(([key, value]) => {
      if (/^camiForms:.*/gm.test(key)) {
        camiFormsTranslations.en[key.replace('camiForms:', '')] = value
      } else uiTranslations.en[key] = value
    })
    Object.entries(translations.ja).forEach(([key, value]) => {
      if (/^camiForms:.*/gm.test(key)) {
        camiFormsTranslations.ja[key.replace('camiForms:', '')] = value
      } else uiTranslations.ja[key] = value
    })

    return { uiTranslations, camiFormsTranslations }
  } catch (error) {
    console.log(
      appName
        ? `⛔️ Fail to import ${appName}.json. Please check if this file is exist in /translations folder!`
        : `⛔️ Please input file name!`
    )
  }
}

export const getLocizeTranslations = async ({
  locizeApp,
  version,
  language,
}) => {
  try {
    const url = getAllTranslationsUrl({ locizeApp, version, language })
    const res = await fetch(url)
    return res.json()
  } catch (error) {
    console.log(error)
  }
}

export const updateLocizeTranslations = async ({
  locizeApp,
  version,
  language,
  body,
}) => {
  try {
    const url = updateTranslationsUrl({ locizeApp, version, language })
    const token = locizeApp === LOCIZE_APP.UI ? UI_TOKEN : CAMI_FORMS_TOKEN
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      json: true,
    }

    const res = await fetch(url, options)
    return res.json()
  } catch (error) {
    console.log(error)
  }
}

export const publishLocizeTranslations = async ({ locizeApp, version }) => {
  try {
    const url = publishTranslationsUrl({ locizeApp, version })
    const token = locizeApp === LOCIZE_APP.UI ? UI_TOKEN : CAMI_FORMS_TOKEN
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      json: true,
    }

    const res = await fetch(url, options)
    return res.json()
  } catch (error) {
    console.log(error)
  }
}
