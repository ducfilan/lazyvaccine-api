import MongoClientConfigs from '../common/configs/mongodb-client.config'

let _categories
let _db

export default class CategoriesDao {
  static async injectDB(conn) {
    if (_categories) {
      return
    }

    try {
      _db = await conn.db(MongoClientConfigs.DatabaseName)
      _categories = await conn.db(MongoClientConfigs.DatabaseName).collection('categories')
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
      [`name.${lang}`]: 1,
      [`description.${lang}`]: 1,
      'path': 1,
      isTopCategory: 1
    }

    try {
      const categories = await _categories
        .find()
        .project(projectRules)
        .toArray()

      return categories
    } catch (e) {
      console.error(`Error, ${e}, ${e.stack}`)
      return []
    }
  }

  static async getSubCategoriesIds(categoryId) {
    try {
      const categories = await _categories
        .find({
          path: { $regex: `,${categoryId},` }
        })
        .project({
          _id: 1
        })
        .toArray()

      if (!categories || !categories.length) {
        return []
      }

      return categories.map(category => category._id)
    } catch (e) {
      console.error(`Error, ${e}, ${e.stack}`)
      return []
    }
  }
}
