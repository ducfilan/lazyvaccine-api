import setsServices from '../services/api/sets.services'

export default class InteractionsController {
  static async apiSubscribeSet(req, res) {
    try {
      const setId = req.params.setId
      const userId = req.user._id

      await setsServices.subscribeSet(userId, setId)

      res.status(200).send()
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }
}
