import MongoClientConfigs from '../common/configs/mongodb-client.config'
import { SetsCollectionName, TopSetsCollectionName, SupportingLanguages } from '../common/consts'

let _topSets
let _db

export default class TopSetsDao {
  static async injectDB(conn) {
    if (_topSets) {
      return
    }

    try {
      _db = await conn.db(MongoClientConfigs.DatabaseName)
      _topSets = await conn.db(MongoClientConfigs.DatabaseName).collection(TopSetsCollectionName)

      _db.command({
        collMod: TopSetsCollectionName,
        validator: {
          $jsonSchema: {
            required: ['_id', 'langCode', 'sets'],
            type: 'object',
            properties: {
              _id: {
                bsonType: 'objectId'
              },
              langCode: {
                enum: SupportingLanguages,
                type: 'string'
              },
              sets: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    setId: {
                      bsonType: 'objectId',
                    },
                    lastUpdated: {
                      bsonType: 'date'
                    }
                  }
                }
              }
            },
            additionalProperties: false,
          }
        }
      })
    } catch (e) {
      console.error(`Unable to establish a collection handle in TopSetsDao: ${e}`)
    }
  }

  /**
   * Get top sets in the specified language
   * @param {string} langCode - language code, e.g. 'en'
   * @returns {Promise(Array)} - Returns the list of sets in the language
   */
  static async getTopSets(langCode) {
    try {
      const topSets = await _topSets
        .aggregate([
          {
            $match: {
              langCode
            }
          },
          {
            $lookup: {
              from: SetsCollectionName,
              localField: 'sets.setId',
              foreignField: '_id',
              as: 'sets',
            }
          },
          {
            $project: {
              _id: 0,
              'sets.items': 0
            }
          }
        ])
        .toArray()

      return topSets[0].sets
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return {}
    }
  }
}
