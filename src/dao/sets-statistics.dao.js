import MongoClientConfigs from '../common/configs/mongodb-client.config'
import { SetsStatisticsCollectionName } from '../common/consts'

let _setsStatistics
let _db

export default class SetsStatisticsDao {
  static async injectDB(conn) {
    if (_setsStatistics) {
      return
    }

    try {
      _db = await conn.db(MongoClientConfigs.DatabaseName)
      _setsStatistics = await conn.db(MongoClientConfigs.DatabaseName).collection(SetsStatisticsCollectionName)
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in SetsStatisticsDao: ${e}`,
      )
    }
  }

  static async getUserSetsStatistics(userId) {
    try {
      return await _setsStatistics
        .findOne({
          _id: userId,
        })
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return false
    }
  }
}
