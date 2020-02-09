import userService from '../services/api/registration.services'

export default class UsersController {
  static async myInfo(req, res, next) {
    return res.status(200).json(req.user);
  }

  static async register(req, res, next) {
    try {
      let { type, token, name, email, picture_url } = req.body
      userService.register({ type, token, name, email, picture_url })

      return res.sendStatus(200)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }
}
