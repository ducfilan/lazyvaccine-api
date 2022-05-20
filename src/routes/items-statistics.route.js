import { Router } from 'express'
import StatisticController from '../controllers/items-statistics.controller'
import auth from '../middlewares/global/auth.mw'

const securedItemsStatisticsRouter = new Router()

securedItemsStatisticsRouter.route('').get(auth, StatisticController.apiGetStatistics)

export { securedItemsStatisticsRouter }