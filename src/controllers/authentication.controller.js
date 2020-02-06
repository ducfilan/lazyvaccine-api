const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


export default class CategoriesController {
  static async apiAuthGoogle(req, res, next) {
    async function verify(token) {
      const ticket = await client.verifyIdToken({
          idToken: token,
          audience: process.env.GOOGLE_CLIENT_ID,
      });
      
      const payload = ticket.getPayload();
      const userid = payload['sub'];
    }

    try {
      let token = req.body.token;

      verify(token).catch(console.error);

      return token;
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }
}
