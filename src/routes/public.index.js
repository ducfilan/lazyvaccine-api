import { Router } from 'express'
import categoriesRoute from './categories.route'
import { publicUserRouter } from './users.route'
import { publicSetsRouter } from './sets.route'
import { publicTopSetRouter } from './top-sets.route'

var publicRouter = Router()

publicRouter.use('/categories', categoriesRoute)
publicRouter.use('/users', publicUserRouter)
publicRouter.use('/sets', publicSetsRouter)
publicRouter.use('/top-sets', publicTopSetRouter)

export default publicRouter
