export default class UsersController {
    static async getUsers(req, res, next) {
        var users = [
            {
                'id': 1
            },
            {
                'id': 2
            }
        ]
        return res.status(200).json(users);
    }
}
