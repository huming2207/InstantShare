import { Router } from 'express'
import createRouter from './create'
import retrieveRouter from './retrieve'

const router = Router();

// The snippet creation router
router.use('/', createRouter);

// The snippet retrieve router
router.use('/', retrieveRouter);

export default router;