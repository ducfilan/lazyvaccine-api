import setsServices from '../services/api/sets.services'

export default class SetsController {
  static async apiCreateSet(req, res) {
    try {
      return res.json(await setsServices.createSet(req.body))
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }

  static async apiGetSet(req, res) {
    try {
      return res.json(await SetsDao.getSet(req.params.set_id))
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }
}
