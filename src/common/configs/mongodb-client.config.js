const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOSTNAME,
  MONGO_PORT,
  MONGO_DB
} = process.env;

export default {
  ConnectionString: MONGO_PORT ? `mongodb://${MONGO_USERNAME}:${encodeURIComponent(MONGO_PASSWORD)}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin` : `mongodb+srv://${MONGO_USERNAME}:${encodeURIComponent(MONGO_PASSWORD)}@${MONGO_HOSTNAME}/?retryWrites=true&w=majority`,
  DatabaseName: MONGO_DB,
  Configs: {
    poolSize: 100,
    retryWrites: true,
    w: 'majority',
    wtimeout: 5000, // ms
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
}
