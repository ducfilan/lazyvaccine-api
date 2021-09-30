const { OAuth2Client } = require('google-auth-library');
const oAuth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const isGoogleTokenValid = async (serviceAccessToken, requestEmail) => {
  try {
    const { email: tokenInfoEmail } = await oAuth2Client.getTokenInfo(serviceAccessToken)
    return tokenInfoEmail.toLowerCase() === requestEmail.toLowerCase()
  } catch (error) {
    return false
  }
}

export const getEmailFromGoogleToken = async (serviceAccessToken) => {
  try {
    const { email } = await oAuth2Client.getTokenInfo(serviceAccessToken)
    return email
  } catch (error) {
    console.log(error)
    return false
  }
}
