import setsServices from '../services/api/sets.services'

export default class SetsController {
  static async apiCreateSet(req, res) {
    try {
      let setInfo = req.body
      setInfo.creatorId = req.user._id
      const registeredSet = await setsServices.createSet(setInfo)

      res.status(200).send(registeredSet)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }

  static async apiGetSet(req, res) {
    try {
      return res.json(await setsServices.getSet(req.params.set_id))
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }

  static async apiGetSetsInCategories(req, res, next) {
    try {
      const { category_id: categoryId } = req.params

      return res.json(await setsServices.getSetsInCategory(categoryId))
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }
}
