import {
  Router
} from 'express'
import CategoriesController from '../controllers/categories.controller'

const router = new Router()

router.route('/').get(CategoriesController.apiGetCategories)

export default router