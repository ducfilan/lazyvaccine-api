import MongoClientConfigs from '../common/configs/mongodb-client.config'
import { ObjectID } from 'mongodb'
import { SetCollectionName, SupportingSetTypes, SupportingLanguages } from '../common/consts'

let _sets
let _db

export default class SetsDao {
  static async injectDB(conn) {
    if (_sets) {
      return
    }

    try {
      _db = await conn.db(MongoClientConfigs.DatabaseName)
      _sets = await conn.db(MongoClientConfigs.DatabaseName).collection(SetCollectionName)

      _db.command({
        collMod: SetCollectionName,
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
      var set = await _sets.findOne({ _id })
      return set
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return false
    }
  }

  static async createSet(set) {
    try {
      return _sets.insertOne(set)
    } catch (e) {
      console.error(`Unable to execute insert command, ${e}`)
      return false
    }
  }

  static async getSet(_id) {
    try {
      return await this.findOneById(ObjectID(_id))
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
              category_id: categoryId,
              del_flag: false
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'creator_id',
              foreignField: '_id',
              as: 'creator',
            },
          },
          {
            $unwind: '$creator',
          },
          {
            $project: {
              title: 1,
              description: 1,
              creator_name: '$creator.name',
              creator_picture: '$creator.picture',
              visibility: 1,
              tags_ids: 1,
              image_url: 1,
              last_updated: 1,
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
