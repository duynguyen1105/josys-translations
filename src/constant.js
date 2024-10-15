export const ENDPOINT = 'https://api.locize.app'
export const LOCIZE_APP = {
  UI: 'ui',
  CAMI_FORMS: 'cami-forms',
}
export const LANGUAGE = {
  EN: 'en-US',
  JP: 'ja-JP',
}

// UI
export const UI_ID = process.env.UI_ID
export const UI_TOKEN = process.env.UI_TOKEN
export const UI_NAMESPACE = 'common'
export const UI_VERSION = {
  STAGING: 'staging',
  PRODUCTION: 'production',
  LATEST: 'latest',
}

// Cami-forms
export const CAMI_FORMS_ID = process.env.CAMI_FORMS_ID
export const CAMI_FORMS_TOKEN = process.env.CAMI_FORMS_TOKEN
export const CAMI_FORMS_NAMESPACE = 'camiForms'
export const CAMI_FORMS_VERSION = {
  LATEST: 'latest',
}
