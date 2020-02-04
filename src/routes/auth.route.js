import {
  Router
} from 'express'
import multer from 'multer'
import AuthenticationController from '../controllers/authentication.controller'

const router = new Router()
const upload = multer()

router.route('/google')
  .post(upload.none(), AuthenticationController.apiAuthGoogle)

export default router
