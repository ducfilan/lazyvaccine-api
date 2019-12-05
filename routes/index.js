var express = require('express');
var router = express.Router();

/* GET home page. */
//router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
//});

var usersRoutes = require('./users.js');

//module.exports = router;
module.exports = function (app) {
    usersRoutes(app);
}