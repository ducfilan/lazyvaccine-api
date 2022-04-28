import { validateSkip, validateLimit } from './common.validator'

export const apiSearchSetValidator = ({ keyword, skip, limit }) => {
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

  return { keyword, skip, limit }
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
