const { OAuth2Client } = require('google-auth-library');
const oAuth2Client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
  eagerRefreshThresholdMillis: 5000,
  forceRefreshOnFailure: true
})

export const isGoogleTokenValid = async (serviceAccessToken, requestEmail) => {
  try {
    if (oAuth2Client.isTokenExpiring(serviceAccessToken)) {
      console.log('isGoogleTokenValid: token is expired')
      return false
    }

    const { email: tokenInfoEmail } = await oAuth2Client.getTokenInfo(serviceAccessToken)
    return tokenInfoEmail.toLowerCase() === requestEmail.toLowerCase()
  } catch (error) {
    console.log('isGoogleTokenValid: error' + error.message)
    return false
  }
}

export const getEmailFromGoogleToken = async (serviceAccessToken) => {
  try {
    if (oAuth2Client.isTokenExpiring(serviceAccessToken)) {
      console.log('getEmailFromGoogleToken: token is expired')
      return null
    }

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

  let { token } = await oAuth2Client.getAccessToken()

  return { access_token: token, refresh_token: refreshToken }
}
