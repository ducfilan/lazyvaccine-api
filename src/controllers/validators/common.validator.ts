import { MaxPaginationLimit, AscOrder, DescOrder } from '../../common/consts'

export const validateSkip = (skip) => (Number.isInteger(skip) && skip >= 0)

export const validateLimit = (limit, maxPaginationLimit = MaxPaginationLimit) => (Number.isInteger(limit) && limit <= maxPaginationLimit && limit > 0)

export const validateOrder = (order) => (order === AscOrder || order === DescOrder)

export class ValidationError extends Error {
  constructor(message = '', ...args: []) {
    super(message, ...args)
  }
}