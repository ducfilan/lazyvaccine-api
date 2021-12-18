import { Router } from 'express'
import InteractionsController from '../controllers/interactions.controller'
import multer from 'multer'
import auth from '../middlewares/global/auth.mw'

const securedInteractionsRouter = new Router()

const upload = multer()

securedInteractionsRouter.route('/:setId/subscription').post(auth, upload.none(), InteractionsController.apiSubscribeSet)

export { securedInteractionsRouter }
