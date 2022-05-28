import MongoClientConfigs from '../common/configs/mongodb-client.config'
import { MissionsCollectionName } from '../common/consts'

let _missions
let _db

export default class MissionsDao {
  static async injectDB(conn) {
    if (_missions) {
      return
    }

    try {
      _db = await conn.db(MongoClientConfigs.DatabaseName)
      _missions = await conn.db(MongoClientConfigs.DatabaseName).collection(MissionsCollectionName)
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in MissionsDao: ${e}`,
      )
    }
  }

  static async getMissions(ids) {
    try {
      return await _missions
        .find({
            missionId: {
                $in: ids
            }
        })
        .toArray()
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return false
    }
  }
}
