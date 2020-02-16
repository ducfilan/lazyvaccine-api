import { Router } from 'express';
import { securedUserRouter } from './users.route';

var router = Router();

router.use('/user', securedUserRouter);

module.exports = router;
