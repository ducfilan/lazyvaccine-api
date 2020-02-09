const { OAuth2Client } = require('google-auth-library');
const oAuth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export default class CategoriesController {
  static async apiAuthGoogle(req, res, next) {
    try {
      let token = req.body.token;

      // TODO: This method will throw if the token is invalid.
      const tokenInfo = await oAuth2Client.getTokenInfo(token);

      return tokenInfo;
    }
    catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }
}
