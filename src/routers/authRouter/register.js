import { Router } from 'express'
import { check, validationResult } from 'express-validator/check'
import User from '../../models/User'
import { signUser } from '../../helpers/userHelper'

const router = Router();

router.post('/register', [
    check('email').isEmail(), check('password').isLength({ min: 6 }), check('nickName').isLength({ min: 3 })
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, error: errors.array(), message: 'Username/password is malformed', token: null });
    }
    
    User.create({
        email: req.body.email,
        password: req.body.password,
        nickName: req.body.nickName
    }, (err, user) => {
        if(err) return res.status(500).json({ success: false, token: null, message: 'Failed to register user, internal server error', error: err });
        const token = signUser(user);
        return res.status(200).json({ success: true, token: token, error: null, message: 'Account created!' });
    });
});

export default router;