import { getTokenFromCode, refreshAccessToken } from '../services/support/google-auth.service'

export default class TokenController {
  static async apiGetTokenFromCode(req, res, next) {
    try {
      const { code } = req.query

      const tokens = await getTokenFromCode(code)
      return res.json(tokens)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }

  static async refreshAccessToken(req, res, next) {
    try {
      const { refreshToken } = req.query

      const tokens = await refreshAccessToken(refreshToken)
      return res.json(tokens)
    } catch (e) {
      console.log(`api, ${e}`)
      if (e.code) {
        res.status(parseInt(e.code)).json(e)
      } else {
        res.status(500).json(e)
      }
    }
  }
}
