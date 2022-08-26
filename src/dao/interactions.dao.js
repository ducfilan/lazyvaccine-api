import { ObjectID } from 'mongodb'
import MongoClientConfigs from '../common/configs/mongodb-client.config'
import { SetsCollectionName, InteractionsCollectionName, SetInteractions, ItemsInteractionsCollectionName } from '../common/consts'

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
                type: 'array',
                items: {
                  enum: SetInteractions,
                  type: 'string',
                }
              },
              lastUpdated: {
                bsonType: 'date'
              },
              testResults: {
                type: 'array',
                items: {
                  required: ['score', 'total', 'takenDateTime'],
                  type: 'object',
                  properties: {
                    score: {
                      bsonType: 'int'
                    },
                    total: {
                      bsonType: 'int'
                    },
                    takenDateTime: {
                      bsonType: 'date'
                    }
                  }
                }
              },

            },
            additionalProperties: false,
          }
        }
      })

      _interactions.createIndex({ userId: 1, setId: 1 }, { name: 'userId_1_setId_1' })
      _interactions.createIndex({ actions: 1 }, { name: 'actions_1' })
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
            $set: { lastUpdated: new Date() }
          },
          {
            upsert: true
          }
        )
    } catch (e) {
      console.log(arguments)
      console.error(`Error, ${e}, ${e.stack}`)
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
            },
            $set: { lastUpdated: new Date() }
          }
        )
    } catch (e) {
      console.log(arguments)
      console.error(`Error, ${e}, ${e.stack}`)
    }
  }

  static async uploadTestResult(userId, setId, result) {
    try {
      await _interactions
        .updateOne(
          {
            userId: ObjectID(userId),
            setId: ObjectID(setId)
          },
          {
            $addToSet: {
              testResults: {
                ...result,
                takenDateTime: new Date()
              }
            },
            $set: { lastUpdated: new Date() }
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
      console.log(arguments)
      console.error(`Error, ${e}, ${e.stack}`)
      return []
    }
  }

  static async filterSetId(userId, setId) {
    try {
      return await _interactions
        .findOne({
          userId: userId,
          setId: setId
        }, {
          _id: 0,
          setId: 1,
          actions: 1,
        }) || {}
    } catch (e) {
      console.error(`Error in filterSetId, ${e}`)
      return {}
    }
  }

  static async getUserInteractedSets(userId, interaction, skip, limit) {
    try {
      const sets = await _interactions
        .aggregate([
          {
            $match: {
              userId,
              actions: { $elemMatch: { $eq: interaction } },
            },
          },
          {
            $skip: skip
          },
          {
            $limit: limit
          },
          {
            $lookup: {
              from: SetsCollectionName,
              localField: 'setId',
              foreignField: '_id',
              as: 'set',
            },
          },
          {
            $unwind: '$set'
          },
          {
            $project: {
              'actions': 1,
              'set': 1
            }
          },
          {
            $project: {
              'set.items': 0,
              'set.delFlag': 0
            }
          }])
        .toArray()

      if (!sets || sets.length === 0) {
        return {}
      }

      let total = await _interactions.find({
        userId,
        actions: { $elemMatch: { $eq: interaction } },
      }).count()

      return { total, sets }
    } catch (e) {
      console.log(arguments)
      console.error(`Error, ${e}, ${e.stack}`)
      return []
    }
  }

  static async getUserRandomSet(userId, interaction) {
    try {
      const set = await _interactions
        .aggregate([
          {
            $match: {
              userId,
              actions: { $elemMatch: { $eq: interaction } },
            },
          },
          {
            $sample: { size: 1 }
          },
          {
            $lookup: {
              from: SetsCollectionName,
              localField: 'setId',
              foreignField: '_id',
              as: 'set',
            },
          },
          {
            $unwind: '$set'
          },
          {
            $lookup: {
              from: ItemsInteractionsCollectionName,
              let: { iSetId: '$setId', iUserId: '$userId' },
              pipeline: [
                {
                  $match:
                  {
                    $expr:
                    {
                      $and:
                        [
                          { $eq: ['$userId', '$$iUserId'] },
                          { $eq: ['$setId', '$$iSetId'] }
                        ]
                    }
                  }
                }
              ],
              as: 'set.itemsInteractions'
            }
          },
        ])
        .project({
          _id: 0,
          setId: 0,
          userId: 0,
          lastUpdated: 0,
          'set.delFlag': 0,
          'set.itemsInteractions._id': 0,
          'set.itemsInteractions.setId': 0,
          'set.itemsInteractions.userId': 0,
          'set.itemsInteractions.lastUpdated': 0,
        })
        .toArray()

      if (!set || set.length === 0) return {}

      return set[0]
    } catch (e) {
      console.log(arguments)
      console.error(`Error, ${e}, ${e.stack}`)
      return {}
    }
  }
}
