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

  static async getAllCategories() {
    try {
      return await categories.find().toArray()
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return {}
    }
  }
}
