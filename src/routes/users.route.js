import { Router } from 'express'
import UsersController from '../controllers/user.controller'
import multer from 'multer'
import auth from '../middlewares/global/auth.mw'

const publicUserRouter = new Router()
const securedUserRouter = new Router()

const upload = multer()

publicUserRouter.route('/register').post(upload.none(), UsersController.register)
publicUserRouter.route('/login').post(upload.none(), UsersController.login)

securedUserRouter.route('/me').get(auth, UsersController.me)
securedUserRouter.route('/logout').get(auth, UsersController.logout)

export {
  publicUserRouter,
  securedUserRouter
}
