import { Router } from 'express';
import categories from './categories.route';
import usersRoutes from './users';

/* GET home page. */
//router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
//});

var router = Router();

router.use('/categories', categories)
router.use('/user', usersRoutes);

module.exports = router;
