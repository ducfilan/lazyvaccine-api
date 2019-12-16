import MongoClientConfigs from '../common/configs/mongodb-client.config'

let users
let db

export default class UsersDao {
  static async injectDB(conn) {
    if (users) {
      return;
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

  static async getAllusers() {
    try {
      return await users.find().toArray()
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return {}
    }
  }

  static async registerUser(userInfo) {
    var checkExist = await users.findOne({'gid': userInfo.id});
    if (checkExist) {
      return;
    }
    return await users.insertOne({   
      'gid' : userInfo.id,
      'name' : userInfo.name,
      'nickname': userInfo.nickname,
      'email' : userInfo.emails,
      'picture' : userInfo.picture
    }, null, function (err, body) {
      if (err) {
        console.log(err);
      }
    });
  }
}
