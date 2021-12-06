import SetsDao from '../../dao/sets.dao'
import TopSetsDao from '../../dao/top-sets.dao'
import { ObjectID } from 'mongodb'
import { BaseCollectionProperties, SupportingTopSetsTypes } from '../../common/consts'

function standardizeSetInfoProperties(setInfo) {
  delete setInfo.captchaToken
  return { ...setInfo, categoryId: ObjectID(setInfo.categoryId), ...BaseCollectionProperties }
}

export default {
  createSet: async (setInfo) => {
    setInfo = standardizeSetInfoProperties(setInfo)

    const insertedId = await SetsDao.createSet(setInfo)
    return insertedId
  },

  getSet: async setId => {
    return await SetsDao.getSet(ObjectID(setId))
  },

  getSetsInCategory: async categoryId => {
    return await SetsDao.getSetsInCategory(categoryId)
  },

  /**
   * Get top sets global
   * @param {string} langCode language code, e.g. 'en'
   * @returns Array of top sets
   */
  getTopSets: async (langCode) => {
    return await TopSetsDao.getTopSets({
      langCode,
      type: SupportingTopSetsTypes.Global
    })
  },

  /**
   * Get top sets in a category
   * @param {string} langCode language code, e.g. 'en'
   * @param {string} categoryId id for the category
   * @returns Array of top sets
   */
  getTopSetsInCategory: async (langCode, categoryId) => {
    return await TopSetsDao.getTopSets({
      langCode,
      type: SupportingTopSetsTypes.Category,
      categoryId: ObjectID(categoryId)
    })
  },
}
