import SetsDao from '../../dao/sets.dao'
import stringService from '../support/string.service'
import visibilities from '../../common/visibilities'
import { ObjectID } from 'mongodb'

function standardizeSetInfoProperties(setInfo) {
  setInfo.tags_ids = stringService.toArray(setInfo.tags_ids)
  setInfo.contributors_id = stringService.toArray(setInfo.contributors_id)
  setInfo.category_id = ObjectID(setInfo.category_id)
  setInfo.visibility = visibilities.draft
  setInfo.last_updated = new Date()
  setInfo.del_flag = false

  return setInfo
}

export default {
  createSet: async ({
    title,
    description,
    contributors_id,
    creator_id,
    category_id,
    tags_ids,
    image_url,
  }) => {
    let setInfo = standardizeSetInfoProperties({
      title,
      description,
      contributors_id,
      creator_id,
      category_id,
      tags_ids,
      image_url,
    })

    const createdSet = await SetsDao.createSet(setInfo)
    return createdSet
  },

  getSet: async setId => {
    return await SetsDao.getSet(setId)
  },

  getSetsInCategory: async categoryId => {
    return await SetsDao.getSetsInCategory(categoryId)
  },
}
