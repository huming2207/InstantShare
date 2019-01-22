import { Router } from 'express'
import login from './login'
import portal from './portal'
import register from './register'

const router = Router();

// The user login router
router.use('/', login);

// The user portal router
router.use('/', portal);

// The user registration router
router.use('/', register);

export default router;