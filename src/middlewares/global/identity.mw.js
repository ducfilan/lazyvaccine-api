import UsersDao from '../../dao/users.dao'
import { getEmailFromGoogleToken } from '../../services/support/google-auth.service'
import { LoginTypes } from '../../common/consts'

export default async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    const loginType = req.header('X-Login-Type')
    if (!token) next()

    let email
    switch (loginType) {
      case LoginTypes.google:
        email = await getEmailFromGoogleToken(token)
        break

      default:
        next()
    }

    if (!email) next()

    const user = await UsersDao.findByEmail(email)

    if (!user) next()

    req.user = user
    next()
  } catch (error) {
    console.log(error)
    next()
  }
}
