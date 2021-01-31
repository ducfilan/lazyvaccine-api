import ItemsDao from '../../dao/items.dao'
import stringService from '../support/string.service'

function standardizeItemsInfoProperties(items) {
  items.last_updated = new Date()
  items.del_flag = false

  return items
}

export default {
  createItems: async (items) => {
    items = standardizeItemsInfoProperties(items)

    const createdItems = await ItemsDao.createItems(items)
    return createdItems
  }
}
