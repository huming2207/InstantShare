import { Router } from 'express'
import authRouter from './authRouter'
import fileRouter from './fileRouter'

const router = Router();

router.use('/user', authRouter);
router.use('/file', fileRouter);
export default router;