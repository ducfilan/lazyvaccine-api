import MongoClientConfigs from '../common/configs/mongodb-client.config'

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
    if (await UsersDao.isUserExists(userInfo.email)) return;

    return await users.insertOne(userInfo, null, function (err, body) {
      if (err) {
        console.log(err)
      }
    });
  }
}
