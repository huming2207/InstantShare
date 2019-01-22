import { Router } from 'express'
import download from './download'
import upload from './upload'

const router = Router();

// The download router
router.use('/', download);

// The upload router
router.use('/', upload);

export default router;