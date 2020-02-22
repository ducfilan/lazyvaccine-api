import MongoClientConfigs from '../common/configs/mongodb-client.config'

let users
let db
let defaultInjection = { projection: { password: 0 } }

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
    return await users.findOne(query, defaultInjection)
  }

  static async findByEmail(email) {
    try {
      var user = await users.findOne({ 'email': email }, defaultInjection);
      return user;
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return false;
    }
  }

  static async updateOne(_id, updateOperations) {
    try {
      var updateResult = await users.findOneAndUpdate({ _id }, updateOperations, defaultInjection)
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
      return { isPreRegistered: true, ...user }
    }

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
