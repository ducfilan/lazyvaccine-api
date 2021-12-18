import { ObjectID } from 'mongodb'
import MongoClientConfigs from '../common/configs/mongodb-client.config'
import { BaseCollectionProperties, InteractionsCollectionName } from '../common/consts'

let _interactions
let _db

export default class InteractionsDao {
  static async injectDB(conn) {
    if (_interactions) {
      return
    }

    try {
      _db = await conn.db(MongoClientConfigs.DatabaseName)
      _interactions = await conn.db(MongoClientConfigs.DatabaseName).collection(InteractionsCollectionName)

      _db.command({
        collMod: InteractionsCollectionName,
        validator: {
          $jsonSchema: {
            required: ['_id', 'setId', 'userId', 'actions', 'lastUpdated', 'delFlag'],
            type: 'object',
            properties: {
              _id: {
                bsonType: 'objectId'
              },
              setId: {
                bsonType: 'objectId'
              },
              userId: {
                bsonType: 'objectId'
              },
              actions: {
                minItems: 1,
                type: 'array',
                items: {
                  type: 'string',
                }
              },
              lastUpdated: {
                bsonType: 'date'
              },
              delFlag: {
                type: 'boolean'
              }
            },
            additionalProperties: false,
          }
        }
      })
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in InteractionsDao: ${e}`,
      )
    }
  }

  static async subscribeSet(userId, setId) {
    try {
      await _interactions
        .updateOne(
          {
            userId: ObjectID(userId),
            setId: ObjectID(setId)
          },
          {
            $addToSet: {
              actions: 'subscribe'
            },
            $set: BaseCollectionProperties
          },
          {
            upsert: true
          }
        )
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return []
    }
  }
}
