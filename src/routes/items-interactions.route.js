import { Router } from 'express'
import ItemsInteractionsController from '../controllers/items-interactions.controller'
import auth from '../middlewares/global/auth.mw'

const securedItemsInteractionsRouter = new Router()

securedItemsInteractionsRouter.route('/:setId/items-interactions/:itemId').post(auth, ItemsInteractionsController.apiInteractItem)
securedItemsInteractionsRouter.route('/:setId/item-interactions').get(auth, ItemsInteractionsController.apiGetTopInteractItem)

export { securedItemsInteractionsRouter }