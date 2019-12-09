import CategoriesDao from '../dao/categories.dao'

export default class CategoriesController {
  static async apiGetCategories(req, res, next) {
    return res.json({
      a: 1
    })
  }
}
