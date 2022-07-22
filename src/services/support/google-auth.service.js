const { OAuth2Client } = require('google-auth-library');
const oAuth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);

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

export const getTokenFromCode = async (code) => {
  let { tokens: { access_token, refresh_token } } = await oAuth2Client.getToken(code)

  return { access_token, refresh_token }
}

export const refreshAccessToken = async (refreshToken) => {
  oAuth2Client.setCredentials({
    refresh_token: refreshToken
  })

  let { tokens: { access_token, refresh_token } } = await oAuth2Client.getAccessToken()

  return { access_token, refresh_token }
}
