import UsersDao from '../../dao/users.dao';
import googleAuthService from '../support/google-auth.service'
import jwtTokenService from '../support/jwt-token.service'
import { ObjectID } from 'mongodb'

export default {
  register: async ({ type, serviceAccessToken, name, email, locale, password, picture: pictureUrl }) => {
    let userInfo = { type, serviceAccessToken, name, email, locale, password, pictureUrl }

    switch (type) {
      case 'google':
        const isTokenValid = await googleAuthService.isTokenValid(serviceAccessToken, email)
        if (!isTokenValid)
          throw new Error('Invalid token')

        const _id = ObjectID()
        const jwtToken = jwtTokenService.generateAuthToken(_id)

        userInfo = { _id, ...userInfo, jwtToken: jwtToken }
        break

      default:
        throw Error('Not supported register type!')
    }

    const registeredUser = await UsersDao.registerUser(userInfo)

    if (registeredUser.isPreRegistered) {
      const jwtToken = jwtTokenService.generateAuthToken(registeredUser._id)
      await UsersDao.updateOne(registeredUser._id, { $set: { jwtToken } })
      registeredUser.jwtToken = jwtToken
    }

    return registeredUser
  },
  update: async (_id, updateItems) => {
    return await UsersDao.updateOne(_id, { $set: updateItems })
  },
  logout: async ({ _id }) => {
    await UsersDao.updateOne(_id, { $set: { jwtToken: null } })
  }
}
