import UsersDao from '@dao/users.dao'
import { getEmailFromGoogleToken } from '@services/support/google-auth.service'
import { CacheKeyUser, LoginTypes } from '@common/consts'
import { getCache, setCache } from '@/common/redis'
import { ObjectId } from 'mongodb'

export default async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    const loginType = req.header('X-Login-Type')
    if (!token) return next()

    let email: string | null
    switch (loginType) {
      case LoginTypes.google:
        email = await getEmailFromGoogleToken(token)
        break

      default:
        return next()
    }

    if (!email) return next()

    const cacheKey = CacheKeyUser(email)
    let user = await getCache(cacheKey)

    if (user) {
      user._id = new ObjectId(user._id)
    } else {
      user = await UsersDao.findByEmail(email)
      setCache(cacheKey, user)
    }

    if (!user) return next()

    req.user = user
    return next()
  } catch (error) {
    console.log(error)
    return next()
  }
}
