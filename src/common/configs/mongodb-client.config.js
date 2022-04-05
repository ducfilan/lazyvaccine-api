const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOSTNAME,
  MONGO_PORT,
  MONGO_DB
} = process.env;

export default {
  // ConnectionString: `mongodb://${MONGO_USERNAME}:${encodeURIComponent(MONGO_PASSWORD)}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`,
  ConnectionString: 'mongodb+srv://lazyvaccine:QqYdLeyawMhqJBy0@lazyvaccine-cluster-0.xyozx.mongodb.net/lazyvaccine?retryWrites=true&w=majority',
  //DatabaseName: MONGO_DB,
  DatabaseName: 'lazyvaccine',
  Configs: {
    poolSize: 100,
    retryWrites: true,
    w: 'majority',
    wtimeout: 5000, // ms
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
}
