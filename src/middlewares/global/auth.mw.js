import UsersDao from '../../dao/users.dao'
import { getEmailFromGoogleToken } from '../../services/support/google-auth.service'
import { LoginTypes } from '../../common/consts'

export default async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '')
        const loginType = req.header('X-Login-Type')
        if (!token) throw new Error('No Authorization token provided!')

        let email
        switch (loginType) {
            case LoginTypes.google:
                email = await getEmailFromGoogleToken(token)
                break

            default:
                throw new Error('Invalid login type')
        }

        const user = await UsersDao.findByEmail(email)
        if (!user) {
            throw new Error()
        }

        req.user = user
        next()
    } catch (error) {
        console.log(error)
        res.status(401).send({ error: 'Not authorized to access this resource' })
    }
}
