import SetsDao from '../../dao/sets.dao'
import TopSetsDao from '../../dao/top-sets.dao'
import InteractionsDao from '../../dao/interactions.dao'
import { ObjectID } from 'mongodb'
import { BaseCollectionProperties, SupportingTopSetsTypes } from '../../common/consts'

function standardizeSetInfoProperties(setInfo) {
  delete setInfo.captchaToken

  // Add _id to items.
  setInfo.items.forEach(item => item._id = item._id ? ObjectID(item._id) : ObjectID())
  return {
    ...setInfo,
    _id: ObjectID(setInfo._id),
    categoryId: ObjectID(setInfo.categoryId),
    ...BaseCollectionProperties
  }
}

export default {
  createSet: async (setInfo) => {
    setInfo = standardizeSetInfoProperties(setInfo)

    const insertedId = await SetsDao.createSet(setInfo)
    return insertedId
  },

  editSet: async (setInfo) => {
    setInfo = standardizeSetInfoProperties(setInfo)

    const { creatorId, interactionCount } = (await SetsDao.getSet(setInfo._id) || {})

    const isCreatorValid = creatorId.equals(setInfo.creatorId)
    if (!isCreatorValid) throw new Error(`no permission to edit set ${creatorId} != ${setInfo.creatorId}`)

    return await SetsDao.replaceSet({ ...setInfo, interactionCount })
  },

  getSet: async (userId, setId) => {
    let set = await SetsDao.getSet(ObjectID(setId))
    if (!set) return null

    if (userId) {
      const { actions } = await InteractionsDao.filterSetId(userId, ObjectID(setId))
      set = { ...set, actions }
    }

    return set
  },

  getSetsInCategory: async (categoryId, skip, limit) => {
    return await SetsDao.getSetsInCategory(categoryId, skip, limit)
  },

  searchSet: async (userId, searchConditions) => {
    const { sets, total } = await SetsDao.searchSet(searchConditions)

    const setIds = sets.map(({ _id }) => _id)

    let interactions = []
    if (userId) {
      interactions = await InteractionsDao.filterSetIds(userId, setIds)
    }

    return { total, sets, interactions }
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

  interactSet: async (action, userId, setId) => {
    await InteractionsDao.interactSet(action, userId, setId)

    // TODO: Use kafka, separate job to sync.
    await SetsDao.interactSet(action, setId)
  },

  undoInteractSet: async (action, userId, setId) => {
    await InteractionsDao.undoInteractSet(action, userId, setId)

    // TODO: Use kafka, separate job to sync.
    await SetsDao.interactSet(action, setId, -1)
  }
}
