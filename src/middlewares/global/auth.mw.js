import { verify } from 'jsonwebtoken'
import UsersDao from '../../dao/users.dao'
import { ObjectId } from 'mongodb'

export default async (req, res, next) => {
    const jwtToken = req.header('Authorization').replace('Bearer ', '')
    const data = verify(jwtToken, process.env.JWT_KEY)
    try {
        const user = await UsersDao.findOne({ _id: ObjectId(data._id), jwtToken: jwtToken })
        if (!user) {
            throw new Error()
        }
        req.user = user
        req.jwtToken = jwtToken
        next()
    } catch (error) {
        console.log(error)
        res.status(401).send({ error: 'Not authorized to access this resource' })
    }
}
