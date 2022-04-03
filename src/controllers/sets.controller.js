import setsServices from '../services/api/sets.services'

export default class SetsController {
  static async apiCreateSet(req, res) {
    try {
      let setInfo = req.body
      setInfo.creatorId = req.user._id

      const registeredSetId = await setsServices.createSet(setInfo)
      if (!registeredSetId) throw new Error('cannot insert set')

      res.status(200).send(registeredSetId)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }

  static async apiEditSet(req, res) {
    try {
      let setInfo = req.body
      setInfo.creatorId = req.user._id

      const success = await setsServices.editSet(setInfo)
      if (!success) throw new Error('cannot update set')

      res.sendStatus(200)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }

  static async apiGetSet(req, res) {
    try {
      return res.json(await setsServices.getSet(req.user?._id, req.params.setId))
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }

  static async apiGetTopSets(req, res) {
    try {
      return res.json(await setsServices.getTopSets(req.user?._id, req.query.lang))
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }

  static async apiGetSetsInCategories(req, res, next) {
    try {
      const { categoryId } = req.params

      return res.json(await setsServices.getSetsInCategory(categoryId))
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }

  static async apiGetTopSetsInCategories(req, res) {
    try {
      const { categoryId } = req.params
      const { lang } = req.query
      return res.json(await setsServices.getTopSetsInCategory(req.user?._id, lang, categoryId))
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }
}
