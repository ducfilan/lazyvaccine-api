import { Router } from 'express'
import SetsController from '../controllers/sets.controller'
import multer from 'multer'
import auth from '../middlewares/global/auth.mw'
import recaptcha from '../middlewares/global/recaptcha.mw'

const publicSetRouter = new Router()
const securedSetRouter = new Router()

const upload = multer()

securedSetRouter.route('/').post(auth, recaptcha, upload.none(), SetsController.apiCreateSet)
publicSetRouter.route('/:setId').get(SetsController.apiGetSet) // TODO: Add Authorization

export { securedSetRouter, publicSetRouter }
