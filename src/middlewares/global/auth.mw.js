import UsersDao from '../../dao/users.dao'
import { getEmailFromGoogleToken } from '../../services/support/google-auth.service'
import { LoginTypes } from '../../common/consts'
import { getCache, setCache } from '../../common/redis'

export default async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    const loginType = req.header('X-Login-Type')
    if (!token) throw new Error('no Authorization token provided!')

    let email
    switch (loginType) {
      case LoginTypes.google:
        email = await getEmailFromGoogleToken(token)
        break

      default:
        throw new Error('invalid login type')
    }

    if (!email) throw new Error('invalid/expired token')

    let user
    const cacheKey = `user_${email}`
    const cachedSet = await getCache(cacheKey)

    if (cachedSet) {
      user = cachedSet
    } else {
      user = await UsersDao.findByEmail(email)
      setCache(cacheKey, user)
    }

    if (!user) throw new Error('not found user with email: ' + email)

    req.user = user
    next()
  } catch (error) {
    res.status(401).send({ error: `Not authorized to access this resource, ${error.message}` })
  }
}
