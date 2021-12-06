import MongoClientConfigs from '../common/configs/mongodb-client.config'
import { SupportingTopSetsTypes, TopSetsCollectionName, SupportingLanguages } from '../common/consts'

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
            required: ['_id', 'type', 'langCode', 'sets'],
            type: 'object',
            properties: {
              _id: {
                bsonType: 'objectId'
              },
              type: {
                enum: Object.values(SupportingTopSetsTypes),
                bsonType: 'int'
              },
              langCode: {
                enum: SupportingLanguages,
                type: 'string'
              },
              sets: {
                type: 'array',
                items: {
                  required: ['setId', 'lastUpdated'],
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
              },
              categoryId: {
                bsonType: 'objectId'
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
   * @returns {Promise(Array)} - Returns the list of sets in the language
   */
  static async getTopSets(matchObject) {
    try {
      const topSets = await _topSets
        .aggregate([
          {
            $match: matchObject
          },
          {
            $lookup: {
              from: 'sets',
              localField: 'sets.setId',
              foreignField: '_id',
              pipeline: [
                {
                  $lookup: {
                    from: 'users',
                    localField: 'creatorId',
                    foreignField: '_id',
                    as: 'creator'
                  }
                },
                {
                  $lookup: {
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'category'
                  }
                },
                {
                  $addFields: {
                    'creatorName': { $arrayElemAt: ['$creator.name', 0] },
                    'creatorImageUrl': { $arrayElemAt: ['$creator.pictureUrl', 0] },
                    'categoryName': { $getField: { field: matchObject.langCode, input: { $arrayElemAt: ['$category.name', 0] } } },
                    'categoryNameEn': { $getField: { field: 'en', input: { $arrayElemAt: ['$category.name', 0] } } }
                  }
                }
              ],
              as: 'sets'
            }
          }, {
            $project: {
              'sets.items': 0,
              'sets.creator': 0,
              'sets.category': 0,
              'sets.delFlag': 0,
            }
          }])
        .toArray()

      return topSets.length > 0 ? topSets[0] : {}
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return {}
    }
  }
}
