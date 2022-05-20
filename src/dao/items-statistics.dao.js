import MongoClientConfigs from '../common/configs/mongodb-client.config'
import { ItemsStatisticsCollectionName } from '../common/consts'

let _itemsStatistics
let _db

export default class ItemsStatisticsDao {
  static async injectDB(conn) {
    if (_itemsStatistics) {
      return
    }

    try {
      _db = await conn.db(MongoClientConfigs.DatabaseName)
      _itemsStatistics = await conn.db(MongoClientConfigs.DatabaseName).collection(ItemsStatisticsCollectionName)
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in ItemsStatisticsDao: ${e}`,
      )
    }
  }

  static async getUserStatistics(userId, beginDate, endDate) {
    try {
      return await _itemsStatistics
        .find({
          userId,
          date: {
            $gte: new Date(beginDate),
            $lte: new Date(endDate)
          }
        })
        .toArray()
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return false
    }
  }
}
