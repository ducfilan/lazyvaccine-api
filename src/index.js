import app from './app'
import { MongoClient } from 'mongodb'
import MongoClientConfigs from './common/configs/mongodb-client.config'

import UsersDao from './dao/users.dao'
import CategoriesDao from './dao/categories.dao'
import SetsDao from './dao/sets.dao'
import TagsDao from './dao/tags.dao'
import TopSetsDao from './dao/top-sets.dao'
import InteractionsDao from './dao/interactions.dao'
import ConfigsDao from './dao/configs.dao'

const port = process.env.NODE_PORT || 8080

MongoClient.connect(
  MongoClientConfigs.ConnectionString,
  MongoClientConfigs.Configs
)
  .catch(err => {
    console.error(err.stack)
    process.exit(1)
  })
  .then(async client => {
    await CategoriesDao.injectDB(client)
    await UsersDao.injectDB(client)
    await SetsDao.injectDB(client)
    await TagsDao.injectDB(client)
    await TopSetsDao.injectDB(client)
    await InteractionsDao.injectDB(client)
    await ConfigsDao.injectDB(client)

    app.listen(port, () => {
      console.log(`listening on port ${port}`)
    })
  })
