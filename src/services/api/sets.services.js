import SetsDao from '../../dao/sets.dao'
import { ObjectID } from 'mongodb'
import { BaseCollectionProperties } from '../../common/consts'

function standardizeSetInfoProperties(setInfo) {
  delete setInfo.captchaToken
  return { ...setInfo, categoryId: ObjectID(setInfo.categoryId), ...BaseCollectionProperties }
}

export default {
  createSet: async (setInfo) => {
    setInfo = standardizeSetInfoProperties(setInfo)

    const createdSet = await SetsDao.createSet(setInfo)
    return createdSet
  },

  getSet: async setId => {
    return await SetsDao.getSet(ObjectID(setId))
  },

  getSetsInCategory: async categoryId => {
    return await SetsDao.getSetsInCategory(categoryId)
  },
}
