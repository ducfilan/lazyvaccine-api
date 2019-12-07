module.exports = function(app) {
    var controller = require('../controllers/auth/userController.js')(app);
	app.get('/users', controller.getUsers);
}
