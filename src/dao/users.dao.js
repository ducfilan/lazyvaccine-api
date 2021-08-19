import MongoClientConfigs from '../common/configs/mongodb-client.config'
import { SupportingLanguages, UserCollectionName } from '../common/consts'

let users
let db
let defaultProjection = { projection: { password: 0 } }

export default class UsersDao {
  static async injectDB(conn) {
    if (users) {
      return
    }

    try {
      db = await conn.db(MongoClientConfigs.DatabaseName)
      users = await conn.db(MongoClientConfigs.DatabaseName)
        .collection(UserCollectionName)

      users.createIndex({ email: 1 }, { unique: true, sparse: true })

      db.command({
        collMod: UserCollectionName,
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['name', 'email', 'locale', 'jwtToken', 'finishedRegisterStep', 'langCodes'],
            properties: {
              name: {
                bsonType: 'string',
              },
              email: {
                bsonType: 'string',
              },
              locale: {
                enum: SupportingLanguages
              },
              finishedRegisterStep: {
                bsonType: 'int',
              },
              langCodes: {
                bsonType: 'array',
                items: [
                  { enum: SupportingLanguages }
                ]
              }
            }
          }
        }
      })
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in usersDao: ${e}`,
      )
    }
  }

  static async findOne(query) {
    return await users.findOne(query, defaultProjection)
  }

  static async findByEmail(email) {
    try {
      var user = await users.findOne({ 'email': email }, defaultProjection);
      return user;
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return false;
    }
  }

  static async updateOne(_id, updateOperations) {
    try {
      var updateResult = await users.findOneAndUpdate({ _id }, updateOperations, defaultProjection)
      return updateResult
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return false
    }
  }

  static async isUserExists(email) {
    return !!this.findByEmail(email)
  }

  static async registerUser(userInfo) {
    let user = await this.findByEmail(userInfo.email)

    if (!!user) {
      delete user.password
      return { isPreRegistered: true, ...user }
    }

    return new Promise((resolve, reject) => {
      users.insertOne(userInfo, null, (error, response) => {
        if (error) {
          reject(error)
        } else {
          const insertedUser = response.ops[0]
          delete insertedUser.password
          resolve(insertedUser)
        }
      })
    })
  }
}
