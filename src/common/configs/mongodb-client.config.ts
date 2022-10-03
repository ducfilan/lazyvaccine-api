import { WriteConcern } from 'mongodb'

const {
  NODE_ENV,
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOSTNAME,
  MONGO_PORT,
  MONGO_DB,
  MONGO_SCHEME
} = process.env;

const portPart = MONGO_PORT ? `:${MONGO_PORT}` : ''

const ConnectionString = `${MONGO_SCHEME}://${MONGO_USERNAME}:${encodeURIComponent(MONGO_PASSWORD)}@${MONGO_HOSTNAME}${portPart}/?retryWrites=true&w=majority`

export default {
  ConnectionString,
  DatabaseName: MONGO_DB,
  Configs: {
    maxPoolSize: 100,
    retryWrites: true,
    writeConcern: new WriteConcern('majority', 5000), // ms 
  }
}
