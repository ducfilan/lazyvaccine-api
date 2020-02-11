import userService from '../services/api/user.services'

export default class UsersController {
  static async me(req, res) {
    return res.status(200).json(req.user);
  }

  static async register(req, res) {
    try {
      await userService.register(req.body)

      return res.sendStatus(200)
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async login(req, res) {
    try {
      const { user, jwt_token } = await userService.login(req.body)

      res.send({ user, jwt_token })
    } catch (e) {
      res.status(400).send({ error: e.message })
    }
  }

  static async logout(req, res) {
    try {
      await userService.logout(req.user)

      res.sendStatus(200)
    } catch (e) {
      res.status(400).send({ error: e.message })
    }
  }
}
