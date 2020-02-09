const { OAuth2Client } = require('google-auth-library');
const oAuth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
import UsersDao from '../../dao/users.dao';

export default (() => {
  return {
    register: async ({ type, token, name, email, picture_url }) => {
      switch (type) {
        case 'google':
          const { email, name, picture: picture_url } = await oAuth2Client.getTokenInfo(token);
          console.log(name, picture_url)
          break

        default:
          break
      }

      return await UsersDao.registerUser({ type, token, name, email, picture_url })
    }
  }
})();
