const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOSTNAME,
  MONGO_PORT,
  MONGO_DB
} = process.env;

export default {
  ConnectionString: `mongodb://${MONGO_USERNAME}:${encodeURIComponent(MONGO_PASSWORD)}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`,
  DatabaseName: MONGO_DB,
  Configs: {
    poolSize: 100,
    w: 'majority',
    wtimeout: 5000, // ms
    useNewUrlParser: true
  }
}
