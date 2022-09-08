import { validateLimit, validateOrder } from './common.validator'

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
