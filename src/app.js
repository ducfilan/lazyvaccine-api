import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import morgan from 'morgan'
import categories from './routes/categories.route'

const app = express()


// TODO: Configure CORS https://expressjs.com/en/resources/middleware/cors.html
app.use(cors())
process.env.NODE_ENV !== 'prod' && app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))
app.use(cookieParser());

// Register api routes
app.use('/api/v1/categories', categories)
app.use('*', (req, res) => res.status(404).json({
  error: 'not found'
}))

export default app
