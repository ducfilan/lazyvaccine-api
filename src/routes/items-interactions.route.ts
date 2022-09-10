import { Router } from 'express'
import ItemsInteractionsController from '../controllers/items-interactions.controller'
import auth from '../middlewares/global/auth.mw'

const securedItemsInteractionsRouter = Router()

securedItemsInteractionsRouter.route('/:setId/items-interactions/:itemId').post(auth, ItemsInteractionsController.apiInteractItem)
securedItemsInteractionsRouter.route('/:setId/item-interactions').get(auth, ItemsInteractionsController.apiGetTopInteractItem)
securedItemsInteractionsRouter.route('/items').get(auth, ItemsInteractionsController.apiGetInteractedItems)
securedItemsInteractionsRouter.route('/count').get(auth, ItemsInteractionsController.apiCountInteractedItems)

export { securedItemsInteractionsRouter }