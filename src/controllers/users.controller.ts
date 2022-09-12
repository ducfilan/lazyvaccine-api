import usersServices from '../services/api/users.services'
import setsServices from '../services/api/sets.services'
import { apiGetUserSetsValidator, apiUpdateUserValidator } from './validators/users.validator'
import { apiSearchSetValidator } from './validators/sets.validator'
import { ValidationError } from './validators/common.validator'

export default class UsersController {
  static async me(req, res) {
    return res.status(200).json(req.user)
  }

  static async getUserInfo(req, res) {
    try {
      const userInfo = await usersServices.getUserInfo(req.params.userId)

      res.status(200).send(userInfo)
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async getUserSets(req, res) {
    try {
      const { interaction, skip, limit } = apiGetUserSetsValidator(req.query)
      const sets = await usersServices.getUserSets(req.params.userId, interaction, skip, limit)

      res.status(200).send(sets)
    } catch (e) {
      console.log(`api, ${e}`)

      switch (e.constructor) {
        case ValidationError:
          res.status(400).json({ error: e })
          break

        default:
          res.status(500).json({ error: e })
          break
      }
    }
  }

  static async getUserRandomSet(req, res) {
    try {
      const set = await usersServices.getUserRandomSet(req.user._id, req.query.interaction)

      res.status(200).send(set)
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async register(req, res) {
    try {
      const registeredUser = await usersServices.register(req.body)

      res.status(200).send(registeredUser)
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async update(req, res) {
    try {
      const updateProperties = apiUpdateUserValidator(req.body)

      const isSuccess = await usersServices.update(req.user._id, updateProperties)
      if (!isSuccess) {
        res.status(400).json({ error: 'update user failed' })
      }

      res.sendStatus(200)
    } catch (e) {
      res.status(400).send({ error: e.message })
    }
  }

  static async logout(req, res) {
    try {
      await usersServices.logout(req.user)

      res.sendStatus(200)
    } catch (e) {
      res.status(400).send({ error: e.message })
    }
  }

  static async apiSuggestSets(req, res) {
    try {
      const searchConditions = apiSearchSetValidator(req.query, req.user.langCodes)
      if (!searchConditions) res.sendStatus(400)

      return res.json(await setsServices.suggestSets(req.user._id, searchConditions))
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }
}
