import CategoriesDao from '../dao/categories.dao'

export default class CategoriesController {
  static async apiGetCategories(req, res, next) {
    try {
      let lang = req.params.lang
      return res.json(CategoriesDao.getAllCategories(lang))
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }
}
