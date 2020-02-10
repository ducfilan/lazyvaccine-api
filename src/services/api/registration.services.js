const { OAuth2Client } = require('google-auth-library');
const oAuth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
import UsersDao from '../../dao/users.dao';

export default {
  register: async ({ type, token, name, email, picture_url }) => {
    switch (type) {
      case 'google':
        ({ email } = await oAuth2Client.getTokenInfo(token))
        break

      default:
        throw Error('Not supported register type!')
        break
    }

    return await UsersDao.registerUser({ type, token, name, email, picture_url })
  }
}
