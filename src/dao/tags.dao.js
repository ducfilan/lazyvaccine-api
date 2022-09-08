import MongoClientConfigs from '../common/configs/mongodb-client.config'
import Consts from '../common/consts'

let tags
let db

export default class TagsDao {
  static async injectDB(conn) {
    if (tags) {
      return
    }

    try {
      db = await conn.db(MongoClientConfigs.DatabaseName)
      tags = await db.collection('tags')
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in TagsDao: ${e}`,
      )
    }
  }

  static async findOne(tag) {
    return tags.findOne({ tag })
  }

  static async getTagsStartWith(start_with) {
    try {
      return (
        await tags
          .find(
            { 'tag': { $regex: `^${start_with}`, $options: 'i' } },
            { limit: Consts.tagsSelectLimit }
          )
          .sort({ tag: 1 })
          .toArray()
      )
    } catch (e) {
      console.log(arguments)
      console.error(`Error, ${e}, ${e.stack}`)
      return {}
    }
  }

  static async createTag(tag) {
    try {
      return await tags.insertOne({ tag }).ops[0]
    } catch (e) {
      console.log(arguments)
      console.error(`Error, ${e}, ${e.stack}`)
      return {}
    }
  }
}
