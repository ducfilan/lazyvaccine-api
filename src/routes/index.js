import { Router } from 'express';
import categoriesRoute from './categories.route';
import usersRoute from './users.route';

/* GET home page. */
//router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
//});

var router = Router();

router.use('/categories', categoriesRoute);
router.use('/auth', authRoute);
router.use('/user', usersRoute);

module.exports = router;
