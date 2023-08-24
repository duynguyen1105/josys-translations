# JOSYS Translations

To handle translations for `josys-ui` and `josys-cami-forms`.

## **How to setup**

- Add `.env` file (request nguyen.nd@raksul.com)
- Run `yarn` to install packages.
- Run `yarn handleTranslations`

## **`translations` folder**

This folder contains all the json files which named by the format `[appName].json`, theirs structure are like:

```json
{
  "en": {
    "common.appA.something": "Sample translation",
    "camiForms:appB.newIntegration.somethingElse": "Something Else"
  },
  "ja": {
    "common.appA.something": "作成日時",
    "camiForms:appB.newIntegration.somethingElse": "更新日時"
  }
}
```

Please **remember** to add the prefix `camiForms:` for the translations of `cami-form`

## Main features

### 1. Add translations

- There are 2 options to add translations for `UI` or `Cami-forms`.
  - `UI`: Press `space` to select which environments you want to add (qa2, staging, staging, production).
  - `Cami-form`: There's only one version: `latest`
- Enter the `appName` you want to add. It will get the `[appName].json` file which is in folder `translations` mentioned above.
- Then, it will check all the translations in file `[appName].json` is already exist on those environments you choose:
  - If exist => DO NOTHING
  - If not => START ADDING

### 2. Check missing translations

There are 2 options for this feature:

- Check if all translations in `[appName].json` is already exist in all environments.
- Will get all the translations on `qa2` then grep by keyword you will input and check if all of them are already on `staging` & `production` or not (only for UI repo).

### 3. Update translations

- Please be careful when using this features because it will modify the values if the keys are already exist. And the usage is similar with `Add translations`.
- To delete a pair, set its value `null`
