import { Router } from 'express'
import SetsController from '../controllers/sets.controller'
import multer from 'multer'
import auth from '../middlewares/global/auth.mw'
import recaptcha from '../middlewares/global/recaptcha.mw'
import identity from '../middlewares/global/identity.mw'

const publicSetsRouter = new Router()
const securedSetsRouter = new Router()

const upload = multer()

securedSetsRouter.route('/').post(auth, recaptcha, upload.none(), SetsController.apiCreateSet)
securedSetsRouter.route('/').patch(auth, recaptcha, upload.none(), SetsController.apiEditSet)
publicSetsRouter.route('/:setId').get(identity, SetsController.apiGetSet) // TODO: Add Authorization

export { securedSetsRouter, publicSetsRouter }
