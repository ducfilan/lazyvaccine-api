import SetsDao from '../../dao/sets.dao'
import TopSetsDao from '../../dao/top-sets.dao'
import InteractionsDao from '../../dao/interactions.dao'
import ItemsInteractionsDao from '../../dao/items-interactions.dao'
import CategoriesDao from '../../dao/categories.dao'
import { ObjectID } from 'mongodb'
import { BaseCollectionProperties, SupportingTopSetsTypes } from '../../common/consts'
import { getCache, setCache, delCache } from '../../common/redis'

function standardizeSetInfoProperties(setInfo) {
  delete setInfo.captchaToken

  // Add _id to items.
  setInfo.items.forEach(item => item._id = item._id ? ObjectID(item._id) : ObjectID())
  return {
    ...setInfo,
    _id: ObjectID(setInfo._id),
    categoryId: ObjectID(setInfo.categoryId),
    ...BaseCollectionProperties()
  }
}

export default {
  createSet: async (setInfo) => {
    setInfo = standardizeSetInfoProperties(setInfo)

    return SetsDao.createSet(setInfo)
  },

  editSet: async (setInfo) => {
    await delCache(setInfo._id)

    setInfo = standardizeSetInfoProperties(setInfo)

    const { creatorId, interactionCount } = (await SetsDao.getSet(setInfo._id) || {})

    const isCreatorValid = creatorId.equals(setInfo.creatorId)
    if (!isCreatorValid) throw new Error(`no permission to edit set ${creatorId} != ${setInfo.creatorId}`)

    return SetsDao.replaceSet(interactionCount ? { ...setInfo, interactionCount } : setInfo)
  },

  getSet: async (userId, setId) => {
    const cacheKey = `set_${setId}`
    let set = await getCache(cacheKey)

    setId = ObjectID(setId)

    if (!set) {
      set = await SetsDao.getSet(setId)
      if (!set) return null

      setCache(cacheKey, set)
    }

    if (userId) {
      const { actions } = await InteractionsDao.filterSetId(userId, setId)
      const itemsInteractions = await ItemsInteractionsDao.getSetItemsInteract(userId, setId)
      set = { ...set, actions, itemsInteractions }
    }

    return set
  },

  getSetsInCategory: async (categoryId, skip, limit) => {
    const subCategoriesIds = await CategoriesDao.getSubCategoriesIds(categoryId)
    return SetsDao.getSetsInCategory([ObjectID(categoryId), ...subCategoriesIds], skip, limit)
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

  suggestSets: async (userId, searchConditions) => {
    const { keyword, skip, limit, languages } = searchConditions

    const cacheKey = `suggestSet_${userId}_${keyword}_${skip}_${limit}_${languages.join()}`
    let suggestResult = await getCache(cacheKey)

    if (suggestResult) {
      suggestResult.sets.forEach(set => set._id = ObjectID(set._id))
    }
    else {
      suggestResult = await SetsDao.suggestSets({ userId, ...searchConditions })
      setCache(cacheKey, suggestResult, { EX: 600 })
    }

    const { sets, total } = suggestResult

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

  interactItem: async (action, userId, setId, itemId) => {
    await ItemsInteractionsDao.interactItem(action, userId, setId, itemId)
  },

  getTopInteractItem: async (action, userId, setId, order, limit) => {
    return ItemsInteractionsDao.getTopInteractItem(action, userId, setId, order, limit)
  },

  undoInteractSet: async (action, userId, setId) => {
    await InteractionsDao.undoInteractSet(action, userId, setId)

    // TODO: Use kafka, separate job to sync.
    await SetsDao.interactSet(action, setId, -1)
  },

  uploadTestResult: async (userId, setId, result) => {
    await InteractionsDao.uploadTestResult(userId, setId, result)
  }
}
