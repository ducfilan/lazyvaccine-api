import app from './app'
import { MongoClient } from 'mongodb'
import MongoClientConfigs from './common/configs/mongodb-client.config'

import UsersDao from './dao/users.dao'
import CategoriesDao from './dao/categories.dao'
import ItemsDao from './dao/items.dao'

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
    await ItemsDao.injectDB(client)
    app.listen(port, () => {
      console.log(`listening on port ${port}`)
    })
  })
