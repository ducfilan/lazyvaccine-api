import { Router } from 'express'
import ItemsController from '../controllers/items.controller'
import multer from 'multer'
import auth from '../middlewares/global/auth.mw'

const router = new Router()

const upload = multer()

router.route('/').post(auth, upload.none(), ItemsController.apiCreateItems)
router.route('/:set_id').get(ItemsController.apiGetItems)

export default router
