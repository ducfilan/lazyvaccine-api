import { verify } from 'jsonwebtoken'
import UsersDao from '../../dao/users.dao'
import { ObjectId } from 'mongodb'

export default async (req, res, next) => {
    const jwt_token = req.header('Authorization').replace('Bearer ', '')
    const data = verify(jwt_token, process.env.JWT_KEY)
    try {
        const user = await UsersDao.findOne({ _id: ObjectId(data._id), jwt_token: jwt_token })
        if (!user) {
            throw new Error()
        }
        req.user = user
        req.token = jwt_token
        next()
    } catch (error) {
        console.log(error)
        res.status(401).send({ error: 'Not authorized to access this resource' })
    }
}
