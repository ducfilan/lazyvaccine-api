const { OAuth2Client } = require('google-auth-library');
const oAuth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export default {
  isTokenValid: async (serviceAccessToken, requestEmail) => {
    try {
      const { email: tokenInfoEmail } = await oAuth2Client.getTokenInfo(serviceAccessToken)
      return tokenInfoEmail.toLowerCase() === requestEmail.toLowerCase()
    } catch (error) {
      return false
    }
  }
}
