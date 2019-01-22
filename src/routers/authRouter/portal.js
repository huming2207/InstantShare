import { Router } from 'express'
import { getUserToken } from '../../helpers/userHelper'

const router = Router();

router.get('/me', (req, res) => {
    const userResult = getUserToken(req);
    return res.status(userResult.statusCode).json({ success: userResult.passed, user: userResult.decodedUser, message: userResult.message });
});

export default router;