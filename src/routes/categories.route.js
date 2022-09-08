import {
  Router
} from 'express'
import CategoriesController from '../controllers/categories.controller'
import SetsController from '../controllers/sets.controller'
import identity from '../middlewares/global/identity.mw'

const router = new Router()

router.route('/').get(CategoriesController.apiGetCategories)
router.route('/:categoryId/sets').get(identity, SetsController.apiGetSetsInCategories)
router.route('/:categoryId/top-sets').get(identity, SetsController.apiGetTopSetsInCategories)

export default router
