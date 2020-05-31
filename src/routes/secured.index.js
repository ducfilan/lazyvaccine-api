import { Router } from 'express'
import { securedUserRouter } from './users.route'
import itemsRouter from './items.route'
import setsRouter from './sets.route'
import tagsRouter from './tags.route'

var router = Router()

router.use('/users', securedUserRouter)
router.use('/sets', setsRouter)
router.use('/items', itemsRouter)
router.use('/tags', tagsRouter)

module.exports = router
