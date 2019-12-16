import { Router } from 'express';
import UsersController from '../controllers/auth/userController';

const router = new Router()

// TODO: User list for debug, need remove when release
router.route('/list').get(UsersController.getUsers)

router.route('/my-info').get(UsersController.myInfo)

export default router
