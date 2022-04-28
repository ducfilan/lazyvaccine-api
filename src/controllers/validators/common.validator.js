import { MaxPaginationLimit } from '../../common/consts'

export const validateSkip = (skip) => (Number.isInteger(skip) && skip >= 0)

export const validateLimit = (limit) => (Number.isInteger(limit) && limit <= MaxPaginationLimit && limit > 0)
