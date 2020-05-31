import SetsDao from '../dao/sets.dao'

export default class SetsController {
  static async apiCreateSet(req, res) {
    try {
      return res.json(await SetsDao.createSet(req.body.set))
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
