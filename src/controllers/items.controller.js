import ItemsDao from '../dao/items.dao'

export default class ItemsController {
  static async apiCreateItems(req, res) {
    try {
      return res.json(await ItemsDao.createItems(req.body.items))
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }
}
