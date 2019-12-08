module.exports = function(app) {

    var getUsers = function(req, res, next) {
        let users = [
            {
                'id': 1
            },
            {
                'id': 2
            }
        ]
        res.status(200).send(users);
    }

    return {
        getUsers: getUsers
    }
}
