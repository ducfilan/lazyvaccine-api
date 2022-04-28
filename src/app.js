import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

import publicRouteIndex from './routes/public.index'
import securedRouteIndex from './routes/secured.index'

import ConfigsDao from './dao/configs.dao'

const app = express()

var corsOptions = {
  origin: function (origin, callback) {
    ConfigsDao.getAllowedOrigins().then((origins) => {
      if (origins.includes(origin) || true) { // TODO: Remove, this is for testing purpose.
        callback(null, origins)
      } else {
        callback(`cors error, not allowed: ${origin}`)
      }
    })
  },
  preflightContinue: true
}

app.use(cors(corsOptions))
process.env.NODE_ENV !== 'prod' && app.use(morgan('dev'))
app.use(express.urlencoded({
  extended: true
}))
app.use(express.json())

app.use('/api/v1', publicRouteIndex);
app.use('/api/v1', securedRouteIndex);

// TODO: remove this code and handle not found exception
app.use('*', (req, res) => res.status(404).json({
  error: 'not found'
}));

export default app
