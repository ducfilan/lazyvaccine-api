import UsersDao from '../../dao/users.dao';
import googleAuthService from '../support/google-auth.service'
import jwtTokenService from '../support/jwt-token.service'
import { ObjectID } from 'mongodb'

export default {
  register: async ({ type, token, name, email, password, picture: picture_url }) => {
    let userInfo = { type, token, name, email, password, picture: picture_url }

    switch (type) {
      case 'google':
        const isTokenValid = await googleAuthService.isTokenValid(token, email)
        if (!isTokenValid)
          throw new Error('Invalid token')

        const _id = ObjectID()
        const jwt_token = jwtTokenService.generateAuthToken(_id)

        userInfo = { _id, ...userInfo, jwt_token }
        break

      default:
        throw Error('Not supported register type!')
    }

    const registeredUser = await UsersDao.registerUser(userInfo)
    return registeredUser
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
