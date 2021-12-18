import { Router } from 'express'
import { securedUserRouter } from './users.route'
import { securedSetsRouter } from './sets.route'
import { securedInteractionsRouter } from './interactions.route'
import tagsRouter from './tags.route'
import imagesRouter from './images.route'

var securedRouter = Router()

securedRouter.use('/users', securedUserRouter)
securedRouter.use('/sets', securedSetsRouter)
securedRouter.use('/interactions', securedInteractionsRouter)
securedRouter.use('/tags', tagsRouter)
securedRouter.use('/images', imagesRouter)

export default securedRouter
