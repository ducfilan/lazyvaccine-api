import MongoClientConfigs from '../common/configs/mongodb-client.config'
import { ObjectID } from 'mongodb'

let _sets
let _db

export default class SetsDao {
  static async injectDB(conn) {
    if (_sets) {
      return
    }

    try {
      _db = await conn.db(MongoClientConfigs.DatabaseName)
      _sets = await conn.db(MongoClientConfigs.DatabaseName).collection('sets')
    } catch (e) {
      console.error(`Unable to establish a collection handle in setsDao: ${e}`)
    }
  }

  static async findOneById(_id) {
    try {
      var set = await _sets.findOne({ _id })
      return set
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return false
    }
  }

  static async createSet(set) {
    try {
      return _sets.insertOne(set)
    } catch (e) {
      console.error(`Unable to execute insert command, ${e}`)
      return false
    }
  }

  static async getSet(_id) {
    try {
      return await this.findOneById(ObjectID(_id))
    } catch (e) {
      console.error(`Unable to execute insert command, ${e}`)
      return false
    }
  }

  /**
   * 
   * @param {string} categoryId - category Id in string form
   * @returns {Promise(Array)} - Returns the list of sets in the category
   */
  static async getSetsInCategory(categoryId) {
    categoryId = ObjectID(categoryId)

    try {
      return await _sets
        .aggregate([
          {
            $match: {
              category_id: categoryId,
              del_flag: false
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "creator_id",
              foreignField: "_id",
              as: "creator",
            },
          },
          {
            $unwind: "$creator",
          },
          {
            $project: {
              title: 1,
              description: 1,
              creator_name: "$creator.name",
              creator_picture: "$creator.picture",
              visibility: 1,
              tags_ids: 1,
              image_url: 1,
              last_updated: 1,
            },
          },
        ])
        .toArray()
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return {}
    }
  }
}
