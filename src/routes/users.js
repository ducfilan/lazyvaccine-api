import { Router } from 'express';
import UsersController from '../controllers/auth/userController';

const router = new Router()

router.route('/list').get(UsersController.getUsers)

export default router
