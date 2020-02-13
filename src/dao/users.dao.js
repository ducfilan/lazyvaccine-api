import MongoClientConfigs from '../common/configs/mongodb-client.config'
import { resolveConfig } from 'prettier'

let users
let db

export default class UsersDao {
  static async injectDB(conn) {
    if (users) {
      return
    }

    try {
      db = await conn.db(MongoClientConfigs.DatabaseName)
      users = await conn.db(MongoClientConfigs.DatabaseName).collection('users')
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in usersDao: ${e}`,
      )
    }
  }

  static async findOne(query) {
    return await users.findOne(query)
  }

  static async findByEmail(email) {
    try {
      var user = await users.findOne({ 'email': email });
      return user;
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return false;
    }
  }

  static async updateOne(_id, field, value) {
    try {
      var user = await users.findOneAndUpdate({ _id }, { $set: { [field]: value } });
      return user;
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return false;
    }
  }

  static async isUserExists(email) {
    try {
      var user = await users.findOne({ 'email': email });
      return !!user;
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return false;
    }
  }

  static async registerUser(userInfo) {
    if (await UsersDao.isUserExists(userInfo.email)) throw Error('User is already registered!');

    return new Promise((resolve, reject) => {
      users.insertOne(userInfo, null, (error, response) => {
        if (error) {
          reject(error)
        } else {
          resolve(response.ops[0])
        }
      })
    })
  }
}
