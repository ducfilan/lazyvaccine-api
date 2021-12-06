import {
  Router
} from 'express'
import CategoriesController from '../controllers/categories.controller'
import SetsController from '../controllers/sets.controller'
import TopSetsController from '../controllers/sets.controller'

const router = new Router()

router.route('/').get(CategoriesController.apiGetCategories)
router.route('/:categoryId/sets').get(SetsController.apiGetSetsInCategories)
router.route('/:categoryId/top-sets').get(TopSetsController.apiGetTopSetsInCategories)

export default router
