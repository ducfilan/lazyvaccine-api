import { Router } from 'express'
import SetsController from '../controllers/sets.controller'

const publicTopSetRouter = new Router()

publicTopSetRouter.route('/').get(SetsController.apiGetTopSets)

export { publicTopSetRouter  }