import { Router } from 'express';
import { securedUserRouter } from './users.route';
import itemRouter from './items.route';

var router = Router();

router.use('/users', securedUserRouter);
router.use('/items', itemRouter);

module.exports = router;
