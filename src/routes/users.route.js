import { Router } from 'express';
import UsersController from '../controllers/user.controller';
import multer from 'multer'

const router = new Router()
const upload = multer()

router.route('/my-info').get(UsersController.myInfo)
router.route('/register').post(upload.none(), UsersController.register)

export default router
