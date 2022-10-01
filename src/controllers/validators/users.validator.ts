import { MaxInt, MaxPaginationLimit, MaxRegistrationsStep } from '../../common/consts'
import { validateLimit, validateSkip, ValidationError } from './common.validator'

export const apiGetUserSetsValidator = ({ interaction, skip, limit }) => {
  skip = Number(skip)
  limit = Number(limit)

  if (!Number.isInteger(skip) || skip < 0) {
    throw new ValidationError('invalid skip value: ' + skip)
  }

  if (!Number.isInteger(limit) || limit > MaxPaginationLimit || limit < 0) {
    throw new ValidationError('invalid limit value: ' + limit)
  }

  if (!interaction) {
    throw new ValidationError('no interaction specified')
  }

  return { interaction, skip, limit }
}

export const apiUpdateUserValidator = ({ langCodes, pages, finishedRegisterStep }) => {
  if (finishedRegisterStep) {
    finishedRegisterStep = Number(finishedRegisterStep)

    if (!Number.isInteger(finishedRegisterStep) || finishedRegisterStep < 0 || finishedRegisterStep > MaxRegistrationsStep) {
      throw new Error('invalid finishedRegisterStep')
    }
  }

  const updateProperties = { langCodes, pages, finishedRegisterStep }

  if (!langCodes || !Array.isArray(langCodes) || langCodes.length === 0) delete updateProperties.langCodes
  if (!pages || !Array.isArray(pages) || pages.length === 0) delete updateProperties.pages
  if (!finishedRegisterStep) delete updateProperties.finishedRegisterStep

  return updateProperties
}

export const apiGetUserRandomSetValidator = ({ skip, limit }) => {
  if (!skip) skip = 0
  if (!limit) limit = MaxInt

  skip = Number(skip)
  limit = Number(limit)

  if (!validateSkip(skip)) {
    throw new Error('invalid skip value')
  }

  if (!validateLimit(limit, MaxInt)) {
    throw new Error('invalid limit value')
  }

  return { skip, limit }
}