import ItemsServices from '../services/api/items.services'

export default class ItemsController {
  static async apiCreateItems(req, res) {
    try {
      return res.json(await ItemsServices.createItems(req.body.setItems, req.user))
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }

  static async apiGetItems(req, res) {
    try {
      return res.json(await ItemsServices.getItems(req.params.set_id))
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }
}
