import { MaxPaginationLimit, MaxRegistrationsStep } from '../../common/consts'

export const apiGetUserSetsValidator = ({ interaction, skip, limit }) => {
  skip = Number(skip)
  limit = Number(limit)

  if (!Number.isInteger(skip) || skip < 0) {
    return false
  }

  if (!Number.isInteger(limit) || limit > MaxPaginationLimit || limit < 0) {
    return false
  }

  if (!interaction) {
    return false
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
