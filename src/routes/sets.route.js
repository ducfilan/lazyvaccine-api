import { Router } from 'express'
import SetsController from '../controllers/sets.controller'
import multer from 'multer'
import auth from '../middlewares/global/auth.mw'
import recaptcha from '../middlewares/global/recaptcha.mw'

const publicSetsRouter = new Router()
const securedSetsRouter = new Router()

const upload = multer()

securedSetsRouter.route('/').post(auth, recaptcha, upload.none(), SetsController.apiCreateSet)
publicSetsRouter.route('/:setId').get(SetsController.apiGetSet) // TODO: Add Authorization

export { securedSetsRouter, publicSetsRouter }
