import userService from '../services/api/user.services'

export default class UsersController {
  static async me(req, res) {
    return res.status(200).json(req.user);
  }

  static async register(req, res) {
    try {
      const registeredUser = await userService.register(req.body)

      res.status(200).send(registeredUser)
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async login(req, res) {
    try {
      const { user, jwtToken: jwtToken } = await userService.login(req.body)

      res.status(200).send({ user, jwtToken: jwtToken })
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
