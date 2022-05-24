import { Router } from 'express'
import InteractionsController from '../controllers/interactions.controller'
import multer from 'multer'
import auth from '../middlewares/global/auth.mw'

const securedInteractionsRouter = new Router()

const upload = multer()

securedInteractionsRouter.route('/:setId/interactions').post(auth, upload.none(), InteractionsController.apiInteractSet)
securedInteractionsRouter.route('/:setId/interactions').delete(auth, upload.none(), InteractionsController.apiUndoInteractSet)

export { securedInteractionsRouter }