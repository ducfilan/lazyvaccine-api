import { Router } from 'express'
import AudioController from '../controllers/audio.controller'
import multer from 'multer'
import auth from '../middlewares/global/auth.mw'

const router = new Router()

const upload = multer()

router.route('/pronounce').get(auth, upload.none(), AudioController.apiGetPronounce)

export default router
