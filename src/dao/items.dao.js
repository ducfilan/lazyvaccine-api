import MongoClientConfigs from '../common/configs/mongodb-client.config'

let _items
let _db

export default class ItemsDao {
  static async injectDB(conn) {
    if (_items) {
      return
    }

    try {
      _db = await conn.db(MongoClientConfigs.DatabaseName)
      _items = await conn.db(MongoClientConfigs.DatabaseName).collection('items')
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
      var items = await _items.find({ 'set_id': set_id }).toArray()
      return items
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
