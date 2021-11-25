import SetsDao from '../../dao/sets.dao'
import TopSetsDao from '../../dao/top-sets.dao'
import { ObjectID } from 'mongodb'
import { BaseCollectionProperties } from '../../common/consts'

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

  getTopSets: async langCode => {
    return await TopSetsDao.getTopSets(langCode)
  },
}
