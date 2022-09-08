import { removeTimeInfo } from '../../common/stringUtils'

export const apiGetStatisticsValidator = ({ beginDate, endDate }) => {
  beginDate = removeTimeInfo(new Date(beginDate))
  endDate = removeTimeInfo(new Date(endDate))

  return { beginDate, endDate }
}
