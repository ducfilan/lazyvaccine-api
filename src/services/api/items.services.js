import ItemsDao from '../../dao/items.dao'
import { ObjectID } from 'mongodb'

function standardizeItemsInfoProperties(setItems) {
  let currentDateTime = new Date()

  setItems.items.forEach(item => {
    item.set_id = ObjectID(setItems.setId)
    item.last_updated = currentDateTime
    item.del_flag = false
  })

  return setItems.items
}

export default {
  createItems: async (setItems, { _id: userId }) => {
    let set = await ItemsDao.findOneBySetId(setItems.setId)
    if (!!set) {
      // TODO: Handle inserting to existing set_id
      if (!set.contributors_id.includes(userId)) {
        // TODO: Throw error, not authorized.
      }
    }
    
    let items = standardizeItemsInfoProperties(setItems)

    const createdItems = await ItemsDao.createItems(items)
    return createdItems
  },

  getItems: async (set_id) => {
    let setItems = await ItemsDao.getItems(set_id)

    return setItems
  }
}
