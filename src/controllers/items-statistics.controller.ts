import usersServices from '../services/api/users.services'
import { apiGetStatisticsValidator } from './validators/items-statistics.validator'

export default class ItemsStatisticsController {
  static async apiGetStatistics(req, res) {
    try {
      const { beginDate, endDate } = apiGetStatisticsValidator(req.query)
      const userId = req.user._id
      return res.json(await usersServices.getUserStatistics(userId, beginDate, endDate))
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }
}
