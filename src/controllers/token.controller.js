import { getTokenFromCode } from '../services/support/google-auth.service'

export default class TokenController {
  static async apiGetTokenFromCode(req, res, next) {
    try {
      const { code } = req.query

      const token = await getTokenFromCode(code)
      return res.json({ token })
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }
}
