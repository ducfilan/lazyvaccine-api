import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routeIndex from './routes/index';
import AuthenticationMiddleware from './middlewares/global/authentication';
import session from 'express-session';
import UsersDao from './dao/users.dao';

const app = express()


// TODO: Configure CORS https://expressjs.com/en/resources/middleware/cors.html
app.use(cors())
process.env.NODE_ENV !== 'prod' && app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

// setup routes
app.use('/api/v1', routeIndex);

// TODO: remove this code and handle not found exception
app.use('*', (req, res) => res.status(404).json({
  error: 'not found'
}));

export default app;
