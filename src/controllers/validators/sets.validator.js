import { SupportingLanguagesMap } from '../../common/consts'
import { validateSkip, validateLimit } from './common.validator'

export const apiSearchSetValidator = ({ keyword, skip, limit, languages }) => {
  skip = Number(skip)
  limit = Number(limit)

  if (!validateSkip(skip)) {
    throw new Error('invalid skip value')
  }

  if (!validateLimit(limit)) {
    throw new Error('invalid limit value')
  }

  if (!keyword) {
    throw new Error('keyword not provided')
  }

  languages = (languages || '').split(',')
  if (!languages || languages.length === 0 || !languages.find(lang => SupportingLanguagesMap[lang])) {
    languages = []
  }

  return { keyword, skip, limit, languages }
}

export const apiGetSetsInCategoriesValidator = ({ skip, limit }) => {
  skip = Number(skip)
  limit = Number(limit)

  if (!validateSkip(skip)) {
    throw new Error('invalid skip value')
  }

  if (!validateLimit(limit)) {
    throw new Error('invalid limit value')
  }

  return { skip, limit }
}
