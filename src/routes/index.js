import { Router } from 'express';
var router = Router();

/* GET home page. */
//router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
//});

import usersRoutes from './users.js';

//module.exports = router;
export default function (app) {
    usersRoutes(app);
}