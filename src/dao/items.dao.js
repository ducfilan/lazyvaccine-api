import MongoClientConfigs from '../common/configs/mongodb-client.config'
import { ObjectID } from "mongodb"

let _items
let _sets
let _db

export default class ItemsDao {
  static async injectDB(conn) {
    if (_items) {
      return
    }

    try {
      _db = await conn.db(MongoClientConfigs.DatabaseName)
      _items = await conn.db(MongoClientConfigs.DatabaseName).collection('items')
      _sets = await conn.db(MongoClientConfigs.DatabaseName).collection('sets')
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in itemsDao: ${e}`,
      )
    }
  }

  static async findOne(query) {
    return await _items.findOne(query)
  }

  static async findOneBySetId(set_id) {
    try {
      var item = await _items.findOne({ 'set_id': set_id })
      return item;
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return false;
    }
  }

  static async findAllBySetId(set_id) {
    try {
      var set = await _sets.aggregate([
          {
            $match: {
              _id: ObjectID(set_id),
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'creator_id',
              foreignField: '_id',
              as: 'creator',
            }
          },
          {
            $unwind: '$creator'
          },
          {
            $lookup: {
              from: 'items',
              localField: '_id',
              foreignField: 'set_id',
              as: 'items',
            }
          },
          {
            $project: {
              title: 1,
              description: 1,
              creator_name: '$creator.name',
              visibility: 1,
              tags_ids: 1,
              image_url: 1,
              last_updated: 1,
              items: 1
            }
          }
        ])
        .limit(1)
        .toArray()

      if(!set) return {}

      return set[0]
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return false;
    }
  }

  static async updateOne(_id, field, value) {
    try {
      var user = await _items.findOneAndUpdate({ _id }, { $set: { [field]: value } })
      return user
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return false;
    }
  }

  static async createItems(items) {
    try {
      let sets = await this.findOneBySetId(items.setId)
      if (!!sets) {
        // TODO: Handle inserting to existing set_id
      }

      return _items.insertMany(items)
    } catch (e) {
      console.error(`Unable to execute insert command, ${e}`)
      return false;
    }
  }

  static async getItems(set_id) {
    try {
      return await this.findAllBySetId(set_id)
    } catch (e) {
      console.error(`Unable to execute insert command, ${e}`)
      return false;
    }
  }
}
