import MongoClientConfigs from '../common/configs/mongodb-client.config'
import { ObjectID } from 'mongodb'
import { SetsCollectionName, UsersCollectionName, SupportingSetTypes, SupportingLanguages, StaticBaseUrl, SetInteractions, BaseCollectionProperties } from '../common/consts'

let _sets
let _db

export default class SetsDao {
  static async injectDB(conn) {
    if (_sets) {
      return
    }

    try {
      _db = await conn.db(MongoClientConfigs.DatabaseName)
      _sets = await conn.db(MongoClientConfigs.DatabaseName).collection(SetsCollectionName)

      _db.command({
        collMod: SetsCollectionName,
        validator: {
          $jsonSchema: {
            required: ['_id', 'name', 'categoryId', 'description', 'tags', 'fromLanguage', 'toLanguage', 'items', 'lastUpdated', 'delFlag'],
            type: 'object',
            properties: {
              _id: {
                bsonType: 'objectId'
              },
              imgUrl: {
                type: 'string',
                pattern: `^${StaticBaseUrl}/[A-z0-9_]+?.(png|jpg|jpeg|PNG|JPG|JPEG)$`
              },
              name: {
                maxLength: 60,
                minLength: 1,
                type: 'string'
              },
              creatorId: {
                bsonType: 'objectId',
              },
              categoryId: {
                bsonType: 'objectId'
              },
              description: {
                maxLength: 250,
                type: 'string'
              },
              tags: {
                maxItems: 20,
                type: 'array',
                items: {
                  uniqueItems: true,
                  type: 'string'
                }
              },
              interactionCount: {
                type: 'object',
                properties: {
                  ...SetInteractions.reduce((previousValue, interaction) => ({
                    ...previousValue, [interaction]: ({
                      bsonType: 'int'
                    })
                  }), {})
                },
                additionalProperties: false
              },
              fromLanguage: {
                enum: SupportingLanguages,
                type: 'string'
              },
              toLanguage: {
                enum: ['', ...SupportingLanguages],
                type: 'string'
              },
              items: {
                minItems: 2,
                type: 'array',
                items: {
                  type: 'object',
                  oneOf: [{
                    required: ['_id', 'type', 'term', 'definition'],
                    type: 'object',
                    properties: {
                      _id: {
                        bsonType: 'objectId'
                      },
                      type: {
                        enum: SupportingSetTypes,
                        type: 'string'
                      },
                      term: {
                        minLength: 1,
                        type: 'string'
                      },
                      definition: {
                        minLength: 1,
                        type: 'string'
                      }
                    },
                  }, {
                    required: ['_id', 'type', 'answers', 'question'],
                    type: 'object',
                    properties: {
                      _id: {
                        bsonType: 'objectId'
                      },
                      type: {
                        enum: SupportingSetTypes,
                        type: 'string'
                      },
                      answers: {
                        minItems: 2,
                        type: 'array',
                        items: {
                          required: [
                            'isCorrect',
                            'answer'
                          ],
                          type: 'object',
                          properties: {
                            isCorrect: {
                              type: 'boolean'
                            },
                            answer: {
                              type: 'string'
                            }
                          },
                        }
                      },
                      question: {
                        minLength: 1,
                        type: 'string'
                      }
                    },
                  }, {
                    required: ['_id', 'type', 'content'],
                    type: 'object',
                    properties: {
                      _id: {
                        bsonType: 'objectId'
                      },
                      type: {
                        enum: SupportingSetTypes,
                        type: 'string'
                      },
                      content: {
                        minLength: 1,
                        type: 'string'
                      }
                    },
                  }]
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
      console.error(`Unable to establish a collection handle in setsDao: ${e}`)
    }
  }

  static async findOneById(_id) {
    try {
      var set = await _sets
        .aggregate([
          {
            $match: {
              _id,
              delFlag: false,
            },
          },
          {
            $lookup: {
              from: UsersCollectionName,
              localField: 'creatorId',
              foreignField: '_id',
              as: 'creator',
            },
          },
          {
            $unwind: '$creator',
          },
          {
            $project: {
              name: 1,
              categoryId: 1,
              description: 1,
              tags: 1,
              fromLanguage: 1,
              toLanguage: 1,
              creatorId: 1,
              creatorName: '$creator.name',
              imgUrl: 1,
              lastUpdated: 1,
              items: 1,
              interactionCount: 1,
            },
          },
        ])
        .limit(1)
        .toArray()

      if (!set || set.length === 0) return {}

      return set[0]
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return false
    }
  }

  static async find(matchCondition, skip, limit) {
    try {
      var sets = await _sets
        .aggregate([
          {
            $match: {
              ...matchCondition,
              delFlag: false,
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
              from: UsersCollectionName,
              localField: 'creatorId',
              foreignField: '_id',
              as: 'creator',
            },
          },
          {
            $unwind: '$creator'
          },
          {
            $project: {
              creatorName: '$creator.name',
              name: 1,
              categoryId: 1,
              description: 1,
              tags: 1,
              fromLanguage: 1,
              toLanguage: 1,
              creatorId: 1,
              imgUrl: 1,
              lastUpdated: 1,
              interactionCount: 1
            }
          }])
        .toArray()

      if (!sets || sets.length === 0) {
        return {}
      }

      var total = await _sets.find({
        ...matchCondition,
        delFlag: false,
      }).count()

      return { total, sets }
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return false
    }
  }

  static async createSet(set) {
    try {
      const insertResult = await _sets.insertOne(set)

      return insertResult.insertedId
    } catch (e) {
      console.error(`Unable to execute insert command, ${e}`)
      return false
    }
  }

  static async replaceSet(set) {
    try {
      const _id = ObjectID(set._id)
      delete set._id

      await _sets.findOneAndReplace({ _id }, set)

      return true
    } catch (e) {
      console.error(`Unable to execute insert command, ${e}`)
      return false
    }
  }

  static async getSet(_id) {
    try {
      return await this.findOneById(_id)
    } catch (e) {
      console.error(`Unable to execute insert command, ${e}`)
      return null
    }
  }

  static async searchSet(searchConditions) {
    try {
      const { keyword, skip, limit } = searchConditions

      const sets = await _sets
        .aggregate([
          {
            $search: {
              index: 'setSearchIndex',
              text: {
                query: keyword,
                path: {
                  'wildcard': '*'
                }
              },
              'count': {
                'type': 'total'
              }
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
              from: 'users',
              localField: 'creatorId',
              foreignField: '_id',
              as: 'creator',
            },
          },
          {
            $unwind: '$creator',
          },
          {
            $project: {
              total: '$$SEARCH_META.count.total',
              name: 1,
              description: 1,
              creatorName: '$creator.name',
              creatorImageUrl: '$creator.pictureUrl',
              fromLanguage: 1,
              toLanguage: 1,
              tags: 1,
              imgUrl: 1,
              lastUpdated: 1,
            },
          },
          {
            $facet: {
              sets: []
            }
          },
          {
            $project: {
              total: { $first: '$sets.total' },
              sets: 1
            }
          },
          {
            $project: {
              'sets.total': 0
            }
          }
        ])
        .toArray()

      if (!sets || sets.length === 0) {
        return {}
      }

      return sets[0]
    } catch (e) {
      console.error(`Unable to execute search command, ${e}`)
      return []
    }
  }

  /**
   * 
   * @param {string} categoryId - category Id in string form
   * @param {int} skip - number of items to skip
   * @param {int} limit - number of items to limit
   * @returns {Promise(Array)} - Returns the list of sets in the category
   */
  static async getSetsInCategory(categoryId, skip, limit) {
    categoryId = ObjectID(categoryId)

    try {
      const sets = await _sets
        .aggregate([
          {
            $match: {
              categoryId,
              delFlag: false
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
              from: 'users',
              localField: 'creatorId',
              foreignField: '_id',
              as: 'creator',
            },
          },
          {
            $unwind: '$creator',
          },
          {
            $project: {
              name: 1,
              description: 1,
              creatorName: '$creator.name',
              creatorImageUrl: '$creator.pictureUrl',
              fromLanguage: 1,
              toLanguage: 1,
              tags: 1,
              imgUrl: 1,
              lastUpdated: 1,
            },
          },
        ])
        .toArray()

      if (!sets || sets.length === 0) {
        return {}
      }

      var total = await _sets.find({
        categoryId,
        delFlag: false
      }).count()

      return { total, sets }
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return {}
    }
  }

  static async interactSet(action, setId, increment = 1) {
    try {
      return await _sets
        .updateOne(
          {
            _id: ObjectID(setId)
          },
          {
            $inc: {
              [`interactionCount.${action}`]: increment
            },
            $set: { lastUpdated: BaseCollectionProperties.lastUpdated }
          },
          {
            upsert: true
          }
        )
    } catch (e) {
      console.error(`Error in interactSet, ${e}`)
      return false
    }
  }
}