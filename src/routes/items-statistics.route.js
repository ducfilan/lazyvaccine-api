import { Router } from 'express'
import ItemsStatisticsController from '../controllers/items-statistics.controller'
import auth from '../middlewares/global/auth.mw'

const securedItemsStatisticsRouter = new Router()

securedItemsStatisticsRouter.route('').get(auth, ItemsStatisticsController.apiGetStatistics)

export { securedItemsStatisticsRouter }