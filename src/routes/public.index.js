import { Router } from 'express';
import categoriesRoute from './categories.route';
import { publicUserRouter } from './users.route';

var router = Router();

router.use('/categories', categoriesRoute);
router.use('/users', publicUserRouter);

module.exports = router;
