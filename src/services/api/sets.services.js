import SetsDao from '../../dao/sets.dao'
import stringService from '../support/string.service'
import visibilities from '../../common/visibilities'

function standardizeSetInfoProperties(setInfo) {
  setInfo.tags_ids = stringService.toArray(setInfo.tags_ids)
  setInfo.contributors_id = stringService.toArray(setInfo.contributors_id)
  setInfo.visibility = visibilities.draft
  setInfo.last_updated = new Date()
  setInfo.del_flag = false

  return setInfo
}

export default {
  createSet: async ({ title, description, contributors_id, creator_id, category_id, tags_ids, image_url }) => {
    let setInfo = standardizeSetInfoProperties({ title, description, contributors_id, creator_id, category_id, tags_ids, image_url })

    const registeredSet = await SetsDao.createSet(setInfo)
    return registeredSet
  }
}
