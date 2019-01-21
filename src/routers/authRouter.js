import { Router } from 'express'
import { check, validationResult } from 'express-validator/check'
import User from '../models/User'
import { signUser, getUserToken } from '../helpers/userHelper'

const router = Router();

router.post('/register', (req, res) => {
    User.create({
        email: req.body.email,
        password: req.body.password,
        nickName: req.body.nickName
    }, (err, user) => {
        if(err) return res.status(500).json({ success: false, token: null, error: [ "Failed to register user, internal server error", err ] });
        const token = signUser(user);
        return res.status(200).json({ success: true, token: token, error: [] });
    });
});

router.get('/me', (req, res) => {
    const userResult = getUserToken(req);
    return res.status(userResult.statusCode).json({ success: userResult.passed, user: userResult.decodedUser, message: userResult.message });
});

router.post('/login', [ check('email').isEmail(), check('password').isLength({ min: 8 }) ], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ auth: false, errors: errors.array(), message: 'Username/password is malformed', token: null });
    }

    User.findOne({ email: req.body.email }, (err, user) => {
        if(err) {
            return res.status(500).json({ auth: false, errors: [ err ], message: 'Failed to query user!', token: null });
        }

        if(!user) {
            return res.status(401).json({ auth: false, errors: [], message: 'Username/password is incorrect!', token: null });
        }

        user.verifyPassword(req.body.password, (err, same) => {
            if(err) {
                return res.status(200).json({ auth: false, errors: [], message: 'Failed to query database!', token: null });
            }

            if(same) {
                const token = signUser(user);
                return res.status(200).json({ auth: true, errors: [], message: 'You are now logged in!', token: token });
            } else {
                return res.status(401).json({ auth: false, errors: [], message: 'Username/password is incorrect!', token: null });
            }
        });
    });
});

export default router;