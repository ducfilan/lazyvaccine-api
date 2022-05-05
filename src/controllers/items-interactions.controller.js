import setsServices from '../services/api/sets.services'

export default class ItemsInteractionsController {
  static async apiInteractItem(req, res) {
    try {
      const { action } = req.query
      const { itemId, setId } = req.params
      const userId = req.user._id

      await setsServices.interactItem(action, userId, setId, itemId)
      res.status(200).send()
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }

  static async apiGetTopInteractItem(req, res) {
    try {
      const { action } = req.query
      const { setId } = req.params
      const userId = req.user._id

      return res.json(await setsServices.getTopInteractItem(action, userId, setId))
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }
}
