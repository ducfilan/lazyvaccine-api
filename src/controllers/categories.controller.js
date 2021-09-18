import CategoryServices from '../services/api/categories.services'

export default class CategoriesController {
  static async apiGetCategories(req, res, next) {
    try {
      const { lang } = req.query

      const categories = await CategoryServices.getAllCategories(lang)
      return res.json(categories)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }
}
