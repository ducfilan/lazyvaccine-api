import { Router } from 'express'
import UsersController from '../controllers/users.controller'
import multer from 'multer'
import auth from '../middlewares/global/auth.mw'

const publicUserRouter = new Router()
const securedUserRouter = new Router()

const upload = multer()

publicUserRouter.route('/').post(upload.none(), UsersController.register)

securedUserRouter.route('/me').patch(auth, upload.none(), UsersController.update)

securedUserRouter.route('/me').get(auth, UsersController.me)
securedUserRouter.route('/:userId').get(UsersController.getUserInfo)
securedUserRouter.route('/logout').get(auth, UsersController.logout)

export {
  publicUserRouter,
  securedUserRouter
}
