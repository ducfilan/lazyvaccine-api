import { google } from 'googleapis';

export default class CategoriesController {
  static async apiAuthGoogle(req, res, next) {
    try {
      let token = req.body.token;

      const auth = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID
      );
      auth.setCredentials(token);
      const plus = google.plus({ version: 'v1', auth });
      const me = await plus.people.get({ userId: 'me' });

      const userGoogleId = me.data.id;

      return token;
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }
}
