import CategoriesDao from '../../dao/categories.dao'

export default {
  getAllCategories: async (lang) => {
    const categories = await CategoriesDao.getAllCategories(lang)

    return categories
  }
}
