import UsersDao from '../../dao/users.dao';
import googleAuthService from '../support/google-auth.service'
import jwtTokenService from '../support/jwt-token.service'
import { ObjectID } from 'mongodb'

export default {
  register: async ({ type, serviceAcesstoken, name, email, password, picture: picture_url }) => {
    let userInfo = { type, serviceAcesstoken, name, email, password, picture: picture_url }

    switch (type) {
      case 'google':
        const isTokenValid = await googleAuthService.isTokenValid(serviceAcesstoken, email)
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
    return registeredUser
  },
  login: async ({ type, serviceAcesstoken, email, password }) => {
    switch (type) {
      case 'google':
        const isTokenValid = await googleAuthService.isTokenValid(serviceAcesstoken, email)
        if (!isTokenValid)
          throw new Error('Invalid token')

        const user = await UsersDao.findByEmail(email)
        if (!user)
          throw new Error('Login failed! Check authentication credentials')

        const jwtToken = jwtTokenService.generateAuthToken(user._id)

        await UsersDao.updateOne(user._id, { $set: { jwtToken } })

        return { user, jwtToken: jwtToken }

      default:
        throw Error('Not supported register type!')
    }
  },
  update: async (_id, updateItems) => {
    return await UsersDao.updateOne(_id, { $set: updateItems })
  },
  logout: async ({ _id }) => {
    await UsersDao.updateOne(_id, { $set: { jwtToken: null } })
  }
}
