import { Router } from 'express'
import downloadRouter from './download'
import uploadRouter from './upload'

const router = Router();

// The download router
router.use('/', downloadRouter);

// The upload router
router.use('/', uploadRouter);

export default router;