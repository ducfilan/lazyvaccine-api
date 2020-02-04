import { Router } from 'express';
import categoriesRoute from './categories.route';
import authRoute from './auth.route';
import usersRoutes from './users';

/* GET home page. */
//router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
//});

var router = Router();

router.use('/categories', categoriesRoute);
router.use('/auth', authRoute);
router.use('/user', usersRoutes);

module.exports = router;
