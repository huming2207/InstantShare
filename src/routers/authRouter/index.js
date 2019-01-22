import { Router } from 'express'
import loginRouter from './login'
import portalRouter from './portal'
import registerRouter from './register'

const router = Router();

// The user login router
router.use('/', loginRouter);

// The user portal router
router.use('/', portalRouter);

// The user registration router
router.use('/', registerRouter);

export default router;