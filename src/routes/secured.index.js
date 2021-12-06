import { Router } from 'express'
import { securedUserRouter } from './users.route'
import { securedSetRouter } from './sets.route'
import tagsRouter from './tags.route'

var securedRouter = Router()

securedRouter.use('/users', securedUserRouter)
securedRouter.use('/sets', securedSetRouter)
securedRouter.use('/tags', tagsRouter)

export default securedRouter
