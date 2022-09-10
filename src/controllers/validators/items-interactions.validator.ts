import { validateLimit, validateOrder, validateSkip, ValidationError } from './common.validator'

export const apiGetTopInteractItemValidator = ({ limit, order }) => {
  limit = Number(limit)

  if (!validateLimit(limit)) {
    throw new Error('invalid limit value')
  }

  if (!validateOrder(order)) {
    throw new Error('invalid order value')
  }

  return { limit, order }
}

export const apiGetInteractedItemsValidator = ({ limit, skip }) => {
  limit = Number(limit)

  if (!validateLimit(limit)) {
    throw new ValidationError('invalid limit value')
  }

  if (!validateSkip(skip)) {
    throw new ValidationError('invalid skip value')
  }

  return { limit, skip }
}
