import { Router } from 'express'
import authRouter from './authRouter'
import fileRouter from './fileRouter'

const router = Router();

// The user router
router.use('/user', authRouter);

// The file router
router.use('/file', fileRouter);

export default router;