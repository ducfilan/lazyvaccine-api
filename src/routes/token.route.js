import {
  Router
} from 'express'
import TokenController from '../controllers/token.controller'

const router = new Router()

router.route('/').get(TokenController.apiGetTokenFromCode)
router.route('/refresh').get(TokenController.refreshAccessToken)

export default router
