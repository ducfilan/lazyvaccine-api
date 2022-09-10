import { WriteConcern } from 'mongodb'

const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOSTNAME,
  MONGO_PORT,
  MONGO_DB
} = process.env;

export default {
  // ConnectionString: MONGO_PORT ? `mongodb://${MONGO_USERNAME}:${encodeURIComponent(MONGO_PASSWORD)}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin` : `mongodb+srv://${MONGO_USERNAME}:${encodeURIComponent(MONGO_PASSWORD)}@${MONGO_HOSTNAME}/?retryWrites=true&w=majority`,
  ConnectionString: `mongodb+srv://${MONGO_USERNAME}:${encodeURIComponent(MONGO_PASSWORD || '')}@lazyvaccine-cluster-0.xyozx.mongodb.net/?retryWrites=true&w=majority`,
  DatabaseName: MONGO_DB,
  Configs: {
    maxPoolSize: 100,
    retryWrites: true,
    writeConcern: new WriteConcern('majority', 5000), // ms 
  }
}
