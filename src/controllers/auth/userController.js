import UsersDao from '../../dao/users.dao';

export default class UsersController {
    static async getUsers(req, res, next) {
        return res.status(200).json(await UsersDao.getAllusers());
    }

    static async myInfo(req, res, next) {
        return res.status(200).json(req.user);
    }
}
