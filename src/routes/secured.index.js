import { Router } from 'express'
import { securedUserRouter } from './users.route'
import { securedSetsRouter } from './sets.route'
import { securedInteractionsRouter } from './interactions.route'
import { securedItemsInteractionsRouter } from './items-interactions.route'
import { securedItemsStatisticsRouter } from './items-statistics.route'
import { securedSetsStatisticsRouter } from './sets-statistics.route'

import tagsRouter from './tags.route'
import imagesRouter from './images.route'

var securedRouter = Router()

securedRouter.use('/users', securedUserRouter)
securedRouter.use('/sets', securedSetsRouter)
securedRouter.use('/interactions', securedInteractionsRouter)
securedRouter.use('/items-interactions', securedItemsInteractionsRouter)
securedRouter.use('/items-statistics', securedItemsStatisticsRouter)
securedRouter.use('/sets-statistics', securedSetsStatisticsRouter)
securedRouter.use('/tags', tagsRouter)
securedRouter.use('/images', imagesRouter)

export default securedRouter
