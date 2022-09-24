import { Router } from 'express'
import UsersController from '../controllers/users.controller'
import multer from 'multer'
import auth from '../middlewares/global/auth.mw'

const publicUserRouter = Router()
const securedUserRouter = Router()

const upload = multer()

publicUserRouter.route('/').post(upload.none(), UsersController.register)

securedUserRouter.route('/me').patch(auth, upload.none(), UsersController.update)

securedUserRouter.route('/me').get(auth, UsersController.me)
securedUserRouter.route('/:userId').get(UsersController.getUserInfo)
securedUserRouter.route('/:userId/sets').get(UsersController.getUserSets)
securedUserRouter.route('/me/random-set').get(auth, UsersController.getUserRandomSet)
securedUserRouter.route('/me/suggestions').get(auth, UsersController.apiSuggestSets)
securedUserRouter.route('/logout').get(auth, UsersController.logout) // TODO: Not in use.

export {
  publicUserRouter,
  securedUserRouter
}
