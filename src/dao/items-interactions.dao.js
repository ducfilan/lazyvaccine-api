import { ObjectID } from 'mongodb'
import MongoClientConfigs from '../common/configs/mongodb-client.config'
import { DefaultMostItemsInteractionsLimit, ItemsInteractions, ItemsInteractionsCollectionName, DescOrder } from '../common/consts'

let _itemsInteractions
let _db

export default class ItemsInteractionsDao {
  static async injectDB(conn) {
    if (_itemsInteractions) {
      return
    }

    try {
      _db = await conn.db(MongoClientConfigs.DatabaseName)
      _itemsInteractions = await conn.db(MongoClientConfigs.DatabaseName).collection(ItemsInteractionsCollectionName)

      _db.command({
        collMod: ItemsInteractionsCollectionName,
        validator: {
          $jsonSchema: {
            type: 'object',
            properties: {
              _id: {
                bsonType: 'objectId'
              },
              setId: {
                bsonType: 'objectId'
              },
              itemId: {
                bsonType: 'objectId'
              },
              userId: {
                bsonType: 'objectId'
              },
              interactionCount: {
                type: 'object',
                properties: {
                  ...ItemsInteractions.reduce((previousValue, interaction) => ({
                    ...previousValue, [interaction]: ({
                      bsonType: 'int'
                    })
                  }), {})
                },
                additionalProperties: false
              },
              lastUpdated: {
                bsonType: 'date'
              }
            },
            additionalProperties: false,
          }
        }
      })

      _itemsInteractions.createIndex({ userId: 1, setId: 1, itemId: 1 }, { name: 'userId_1_setId_1_itemId_1' })
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in ItemsInteractionsDao: ${e}`,
      )
    }
  }

  static async interactItem(action, userId, setId, itemId, increment = 1) {
    try {
      return await _itemsInteractions
        .updateOne(
          {
            userId: ObjectID(userId),
            setId: ObjectID(setId),
            itemId: ObjectID(itemId)
          },
          {
            $inc: {
              [`interactionCount.${action}`]: increment
            },
            $set: { lastUpdated: new Date() }
          },
          {
            upsert: true
          }
        )
    } catch (e) {
      console.log(arguments)
      console.error(`Error, ${e}, ${e.stack}`)
      return false
    }
  }

  static async getTopInteractItem(action, userId, setId, order, limit = DefaultMostItemsInteractionsLimit) {
    let sortField = `interactionCount.${action}`
    try {
      return await _itemsInteractions
        .aggregate([
          {
            $match: {
              setId: ObjectID(setId),
              userId: ObjectID(userId)
            },
          },
          { $sort: { [sortField]: order === DescOrder ? -1 : 1 } },
          {
            $limit: limit
          },
        ])
        .toArray()
    } catch (e) {
      console.log(arguments)
      console.error(`Error, ${e}, ${e.stack}`)
      return false
    }
  }
}
