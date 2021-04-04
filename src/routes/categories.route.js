import {
  Router
} from 'express'
import CategoriesController from '../controllers/categories.controller'
import SetsController from '../controllers/sets.controller'

const router = new Router()

router.route('/').get(CategoriesController.apiGetCategories)
router.route('/:category_id/sets').get(SetsController.apiGetSetsInCategories)

export default router
