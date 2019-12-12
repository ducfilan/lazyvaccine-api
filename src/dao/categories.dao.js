import MongoClientConfigs from '../common/configs/mongodb-client.config'

let categories
let db

export default class CategoriesDao {
  static async injectDB(conn) {
    if (categories) {
      return
    }

    try {
      db = await conn.db(MongoClientConfigs.DatabaseName)
      categories = await conn.db(MongoClientConfigs.DatabaseName).collection('categories')
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in CategoriesDao: ${e}`,
      )
    }
  }

  /**
   * 
   * @param {string} lang - Target language for displaying in UI
   * @returns {Array} - Returns the list of categories and subs
   */
  static async getAllCategories(lang) {
    let projectRules = {
      '_id': 0,
      'name': 1,
      'description': 1,
      'path': 1
    }

    try {
      return (
        await categories
          .find()
          .project(projectRules)
          .toArray()
      ).map(category => ({
        name: category.name[lang],
        description: category.description ? category.description[lang] : null,
        path: category.path
      }))
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return {}
    }
  }
}
