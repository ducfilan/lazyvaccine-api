import { Router } from 'express'
import SetsController from '../controllers/sets.controller'
import identity from '../middlewares/global/identity.mw'

const publicTopSetRouter = new Router()

publicTopSetRouter.route('/').get(identity, SetsController.apiGetTopSets)

export { publicTopSetRouter }