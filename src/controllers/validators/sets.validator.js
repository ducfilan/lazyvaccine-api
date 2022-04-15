import { MaxPaginationLimit } from '../../common/consts'

export const apiSearchSetValidator = ({ keyword, skip, limit }) => {
  skip = Number(skip)
  limit = Number(limit)

  if (!Number.isInteger(skip) || limit < 0) {
    return false
  }

  if (!Number.isInteger(limit) || limit > MaxPaginationLimit || limit < 0) {
    return false
  }

  if (!keyword) {
    return false
  }

  return { keyword, skip, limit }
}