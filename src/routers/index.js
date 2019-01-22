import { Router } from 'express'
import authRouter from './authRouter'
import fileRouter from './fileRouter'
import snippetRouter from './snippetRouter'

const router = Router();

// The user router
router.use('/user', authRouter);

// The file router
router.use('/file', fileRouter);

// The snippet router
router.use('/snippet', snippetRouter);

export default router;