import SetsDao from '../../dao/sets.dao'
import TopSetsDao from '../../dao/top-sets.dao'
import InteractionsDao from '../../dao/interactions.dao'
import { ObjectID } from 'mongodb'
import { BaseCollectionProperties, SupportingTopSetsTypes } from '../../common/consts'

function standardizeSetInfoProperties(setInfo) {
  delete setInfo.captchaToken

  // Add _id to items.
  setInfo.items.foreach(item => item._id = ObjectID())
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
   * @param {string} userId current user id
   * @param {string} langCode language code, e.g. 'en'
   * @returns Array of top sets
   */
  getTopSets: async (userId, langCode) => {
    const topSets = await TopSetsDao.getTopSets({
      langCode,
      type: SupportingTopSetsTypes.Global
    })

    const topSetIds = topSets.map(({ _id }) => _id)

    let interactions = []
    if (userId) {
      interactions = await InteractionsDao.filterSetIds(userId, topSetIds)
    }

    return { topSets, interactions }
  },

  /**
   * Get top sets in a category
   * @param {string} userId current user id
   * @param {string} langCode language code, e.g. 'en'
   * @param {string} categoryId id for the category
   * @returns Array of top sets
   */
  getTopSetsInCategory: async (userId, langCode, categoryId) => {
    const topSets = await TopSetsDao.getTopSets({
      langCode,
      type: SupportingTopSetsTypes.Category,
      categoryId: ObjectID(categoryId)
    })

    const topSetIds = topSets.map(topSet => topSet._id)

    let interactions = []
    if (userId) {
      interactions = await InteractionsDao.filterSetIds(userId, topSetIds)
    }

    return { topSets, interactions }
  },

  subscribeSet: async (userId, setId) => {
    await InteractionsDao.subscribeSet(userId, setId)
  }
}
