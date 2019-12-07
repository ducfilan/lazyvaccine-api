module.exports = function(app) {

    var checkAuthority = function(req, res, next) {
        // TODO: Check authority and filter invalid access here
        next();
    }

    return {
        checkAuthority: checkAuthority
    }
}
