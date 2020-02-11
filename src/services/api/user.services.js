import UsersDao from '../../dao/users.dao';
import googleAuthService from '../support/google-auth.service'
import jwtTokenService from '../support/jwt-token.service'

export default {
  register: async ({ type, token, name, email, password, picture: picture_url }) => {
    switch (type) {
      case 'google':
        const isTokenValid = await googleAuthService.isTokenValid(token, email)
        if (!isTokenValid)
          throw new Error('Invalid token')
        break

      default:
        throw Error('Not supported register type!')
    }

    return await UsersDao.registerUser({ type, token, name, email, password, picture_url })
  },
  login: async ({ type, token, email, password }) => {
    switch (type) {
      case 'google':
        const isTokenValid = await googleAuthService.isTokenValid(token, email)
        if (!isTokenValid)
          throw new Error('Invalid token')

        const user = await UsersDao.findByEmail(email)
        if (!user)
          throw new Error('Login failed! Check authentication credentials')

        const jwt_token = jwtTokenService.generateAuthToken(user._id)

        await UsersDao.updateOne(user._id, 'jwt_token', jwt_token)

        return { user, jwt_token }

      default:
        throw Error('Not supported register type!')
    }
  },
  logout: async ({ _id }) => {
    await UsersDao.updateOne(_id, 'jwt_token', null)
  }
}
