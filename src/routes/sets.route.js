import { Router } from 'express'
import SetsController from '../controllers/sets.controller'
import multer from 'multer'
import auth from '../middlewares/global/auth.mw'

const router = new Router()

const upload = multer()

router.route('/').post(auth, upload.none(), SetsController.apiCreateSet)
router.route('/:set_id').get(SetsController.apiGetSet) // TODO: Add Authorization

export default router
