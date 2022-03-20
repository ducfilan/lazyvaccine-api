import { ObjectID } from 'mongodb'
import MongoClientConfigs from '../common/configs/mongodb-client.config'
import { BaseCollectionProperties, InteractionsCollectionName, SetInteractions } from '../common/consts'

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
            required: ['_id', 'setId', 'userId', 'actions', 'lastUpdated'],
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
                  enum: SetInteractions,
                  type: 'string',
                }
              },
              lastUpdated: {
                bsonType: 'date'
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

  static async interactSet(action, userId, setId) {
    try {
      await _interactions
        .updateOne(
          {
            userId: ObjectID(userId),
            setId: ObjectID(setId)
          },
          {
            $addToSet: {
              actions: action
            },
            $set: { lastUpdated: BaseCollectionProperties.lastUpdated }
          },
          {
            upsert: true
          }
        )
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
    }
  }

  static async undoInteractSet(action, userId, setId) {
    try {
      await _interactions
        .updateOne(
          {
            userId: ObjectID(userId),
            setId: ObjectID(setId)
          },
          {
            $pull: {
              actions: action
            }
          }
        )
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
    }
  }

  static async filterSetIds(userId, setIds) {
    try {
      return await _interactions
        .find({
          userId: userId,
          setId: { $in: setIds }
        })
        .project({
          _id: 0,
          setId: 1,
          actions: 1,
        })
        .toArray()
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return []
    }
  }
}
