module.exports = function(app) {

    var checkAuthority = function(req, res, next) {

        req.next();
    }

    return {
        checkAuthority: checkAuthority
    }
}
