import { ObjectID } from 'mongodb'
import UsersDao from '../../dao/users.dao'
import InteractionsDao from '../../dao/interactions.dao'
import SetsDao from '../../dao/sets.dao'
import { isGoogleTokenValid } from '../support/google-auth.service'
import { LoginTypes } from '../../common/consts'

export default {
  register: async (requestBody) => {
    const { type, serviceAccessToken, finishedRegisterStep,
      name, email, locale, password, picture: pictureUrl
    } = requestBody

    let userInfo = {
      type,
      serviceAccessToken,
      finishedRegisterStep,
      name,
      email,
      locale,
      password,
      pictureUrl,
      langCodes: [locale]
    }

    switch (type) {
      case LoginTypes.google:
        const isTokenValid = await isGoogleTokenValid(serviceAccessToken, email)
        if (!isTokenValid)
          throw new Error('Invalid token')

        break

      default:
        throw Error('Not supported register type!')
    }

    const registeredUser = await UsersDao.registerUser(userInfo)

    return registeredUser
  },
  getUserInfo: async (userId) => {
    return await UsersDao.findOne({ _id: ObjectID(userId) })
  },
  getUserSets: async (userId, interaction) => {
    switch (interaction) {
      case 'create':
        const sets = await SetsDao.find({ creatorId: ObjectID(userId) })
        const setIds = sets.map(({ _id }) => _id)

        const interactions = await InteractionsDao.filterSetIds(userId, setIds) || []

        return sets.map(set => ({
          actions: interactions.find(i => i.setId == set._id)?.actions || [],
          set
        }))
      default:
        return await InteractionsDao.getUserInteractedSets(ObjectID(userId), interaction)
    }
  },
  update: async (_id, updateItems) => {
    return await UsersDao.updateOne(_id, { $set: updateItems })
  },
  logout: async ({ _id }) => {
    return await UsersDao.updateOne(_id, { $set: { jwtToken: null } })
  }
}
