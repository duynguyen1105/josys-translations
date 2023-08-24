import inquirer from 'inquirer'
import { addTranslations } from './addTranslations.js'
import { checkTranslations } from './checkTranslations.js'
import { updateTranslations } from './updateTranslations.js'

const questions = [
  {
    type: 'list',
    name: 'action',
    message: 'Which action you want to do?',
    choices: [
      {
        name: 'Add translations',
        value: 'add',
      },
      {
        name: 'Check missing translations',
        value: 'check',
      },
      {
        name: 'Update translations',
        value: 'update',
      },
    ],
  },
]

;(async () => {
  const { action } = await inquirer.prompt(questions)

  switch (action) {
    case 'add':
      addTranslations()
      break
    case 'check':
      checkTranslations()
      break
    case 'update':
      updateTranslations()
      break

    default:
      addTranslations()
      break
  }
})()
