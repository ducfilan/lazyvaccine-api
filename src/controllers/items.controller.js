import CategoriesDao from '../dao/categories.dao'

export default class CategoriesController {
  static async apiCreateItems(req, res) {
    try {
      return res.json(await CategoriesDao.getAllCategories(lang))
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }
}
