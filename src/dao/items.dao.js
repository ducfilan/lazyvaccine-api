import MongoClientConfigs from '../common/configs/mongodb-client.config'

let _topSets
let _db

export default class TopSetsDao {
  static async injectDB(conn) {
    if (_topSets) {
      return
    }

    try {
      _db = await conn.db(MongoClientConfigs.DatabaseName)
      _topSets = await conn.db(MongoClientConfigs.DatabaseName).collection('topSets')
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in TopSetsDao: ${e}`,
      )
    }
  }

  /**
   * 
   * @param {string} lang - Target language for displaying in UI
   * @returns {Array} - Returns the list of topSets and subs
   */
  static async getAlltopSets(lang) {
    let projectRules = {
      [`name.${lang}`]: 1,
      [`description.${lang}`]: 1,
      'path': 1
    }

    try {
      const topSets = await _topSets
        .find()
        .project(projectRules)
        .toArray()

      return topSets
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return []
    }
  }
}
