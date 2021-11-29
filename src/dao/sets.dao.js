import MongoClientConfigs from '../common/configs/mongodb-client.config'
import { ObjectID } from 'mongodb'
import { SetsCollectionName, SupportingSetTypes, SupportingLanguages } from '../common/consts'

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
              captchaToken: {
                type: 'string'
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
                    required: ['type', 'term', 'definition'],
                    type: 'object',
                    properties: {
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
                    required: ['type', 'answers', 'question'],
                    type: 'object',
                    properties: {
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
                    required: ['type', 'content'],
                    type: 'object',
                    properties: {
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
              categoryId: 1,
              description: 1,
              tags: 1,
              fromLanguage: 1,
              toLanguage: 1,
              creatorId: 1,
              creatorName: '$creator.name',
              imageUrl: 1,
              lastUpdated: 1,
              items: 1,
            },
          },
        ])
        .limit(1)
        .toArray()

      if (!set) return {}

      return set[0]
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

  static async getSet(_id) {
    try {
      return await this.findOneById(_id)
    } catch (e) {
      console.error(`Unable to execute insert command, ${e}`)
      return false
    }
  }

  /**
   * 
   * @param {string} categoryId - category Id in string form
   * @returns {Promise(Array)} - Returns the list of sets in the category
   */
  static async getSetsInCategory(categoryId) {
    categoryId = ObjectID(categoryId)

    try {
      return await _sets
        .aggregate([
          {
            $match: {
              categoryId,
              delFlag: false
            },
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
              creatorPicture: '$creator.picture',
              fromLanguage: 1,
              toLanguage: 1,
              tags: 1,
              imageUrl: 1,
              lastUpdated: 1,
            },
          },
        ])
        .toArray()
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return {}
    }
  }
}