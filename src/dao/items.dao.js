import MongoClientConfigs from '../common/configs/mongodb-client.config'

let items
let db

export default class ItemsDao {
  static async injectDB(conn) {
    if (items) {
      return
    }

    try {
      db = await conn.db(MongoClientConfigs.DatabaseName)
      items = await conn.db(MongoClientConfigs.DatabaseName).collection('items')
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in itemsDao: ${e}`,
      )
    }
  }

  static async findOne(query) {
    return await items.findOne(query)
  }

  static async findBySetId(setId) {
    try {
      var items = await items.findOne({ 'set_id': setId });
      return items;
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return false;
    }
  }

  static async updateOne(_id, field, value) {
    try {
      var user = await items.findOneAndUpdate({ _id }, { $set: { [field]: value } });
      return user;
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return false;
    }
  }

  static async createItems(items) {
    try {
      let sets = await this.findBySetId(items.setId)
      if (!!sets) {
        // TODO: Handle inserting to existing set_id
      }

      items.insert(items)
    } catch (e) {
      console.error(`Unable to execute insert command, ${e}`)
      return false;
    }
  }
}
