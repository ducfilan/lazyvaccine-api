import { ObjectID } from 'mongodb'
import UsersDao from '../../dao/users.dao'
import InteractionsDao from '../../dao/interactions.dao'
import SetsDao from '../../dao/sets.dao'
import ItemsStatisticsDao from '../../dao/items-statistics.dao'
import SetsStatisticsDao from '../../dao/sets-statistics.dao'
import { isGoogleTokenValid } from '../support/google-auth.service'
import { LoginTypes, SupportingLanguagesMap, DefaultLangCode } from '../../common/consts'

export default {
  register: async (requestBody) => {
    let { type, serviceAccessToken, finishedRegisterStep,
      name, email, locale, password, picture: pictureUrl
    } = requestBody

    locale = locale.substring(0, 2)
    locale = SupportingLanguagesMap[locale] ? locale : DefaultLangCode

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

    return UsersDao.registerUserIfNotFound(userInfo)
  },

  getUserInfo: async (userId) => {
    return UsersDao.findOne({ _id: ObjectID(userId) })
  },

  getUserSets: async (userId, interaction, skip, limit) => {
    switch (interaction) {
      case 'create':
        let resp = await SetsDao.find({ creatorId: ObjectID(userId) }, skip, limit)
        const setIds = resp.sets.map(({ _id }) => _id)

        const interactions = await InteractionsDao.filterSetIds(userId, setIds) || []

        resp.sets.forEach((set, index) => resp.sets[index] = ({
          actions: interactions.find(i => i.setId == set._id)?.actions || [],
          set
        }))

        return resp
      default:
        return InteractionsDao.getUserInteractedSets(ObjectID(userId), interaction, skip, limit)
    }
  },

  getUserRandomSet: async (userId, interaction) => {
    return InteractionsDao.getUserRandomSet(ObjectID(userId), interaction)
  },

  update: async (_id, updateItems) => {
    return UsersDao.updateOne(_id, { $set: updateItems })
  },

  logout: async ({ _id }) => {
    return UsersDao.updateOne(_id, { $set: { jwtToken: null } })
  },

  getUserStatistics: async (_id, beginDate, endDate) => {
    return ItemsStatisticsDao.getUserStatistics(_id, beginDate, endDate)
  },

  getSetsStatistics: async (_id) => {
    return SetsStatisticsDao.getUserSetsStatistics(_id)
  }
}
