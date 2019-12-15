import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import routeIndex from './routes/index';

const app = express()


// TODO: Configure CORS https://expressjs.com/en/resources/middleware/cors.html
app.use(cors())
process.env.NODE_ENV !== 'prod' && app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))
app.use(cookieParser());

// setup routes
app.use('/api/v1', routeIndex);
// TODO: remove this code and handle not found exception
app.use('*', (req, res) => res.status(404).json({
  error: 'not found'
}))

export default app;
