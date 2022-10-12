import { MongoClient, ObjectId } from "mongodb"
import { DatabaseName } from "../../src/common/configs/mongodb-client.config"
import { UsersCollectionName } from "../../src/common/consts"

export const addUser = async (mongodbClient: MongoClient, userInfo: object): Promise<ObjectId> => {
  return (await mongodbClient.db(DatabaseName).collection(UsersCollectionName).insertOne(userInfo)).insertedId
}
