import { Router } from 'express'
import SetsController from '../controllers/sets.controller'
import multer from 'multer'
import auth from '../middlewares/global/auth.mw'
import recaptcha from '../middlewares/global/recaptcha.mw'

const router = new Router()

const upload = multer()

router.route('/').post(auth, recaptcha, upload.none(), SetsController.apiCreateSet)
router.route('/:set_id').get(SetsController.apiGetSet) // TODO: Add Authorization

export default router
