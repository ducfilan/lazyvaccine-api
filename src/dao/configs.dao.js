import MongoClientConfigs from '../common/configs/mongodb-client.config'

let _configs
let _db

export default class ConfigsDao {
  static async injectDB(conn) {
    if (_configs) {
      return
    }

    try {
      _db = await conn.db(MongoClientConfigs.DatabaseName)
      _configs = await conn.db(MongoClientConfigs.DatabaseName).collection('configs')
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in ConfigsDao: ${e}`,
      )
    }
  }

  static async getAllowedOrigins() {
    let projectRules = {
      _id: 0,
      origins: 1
    }

    try {
      const { origins } = await _configs
        .findOne({
          type: 'allowed_origins'
        }, projectRules)

      return origins
    } catch (e) {
      console.error(`Error, ${e}, ${e.stack}`)
      return []
    }
  }
}
