import { Router } from 'express'
import { check, validationResult } from 'express-validator/check'
import User from '../../models/User'
import { signUser } from '../../helpers/userHelper'

const router = Router();

router.post('/login', [ check('email').isEmail(), check('password').isLength({ min: 8 }) ], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, error: errors.array(), message: 'Username/password is malformed', token: null });
    }

    User.findOne({ email: req.body.email }, (err, user) => {
        if(err) {
            return res.status(500).json({ success: false, error: err, message: 'Failed to query user!', token: null });
        }

        if(!user) {
            return res.status(401).json({ success: false, error: null, message: 'Username/password is incorrect!', token: null });
        }

        user.verifyPassword(req.body.password, (err, same) => {
            if(err) {
                return res.status(200).json({ success: false, error: null, message: 'Failed to query database!', token: null });
            }

            if(same) {
                const token = signUser(user);
                return res.status(200).json({ success: true, error: null, message: 'You are now logged in!', token: token });
            } else {
                return res.status(401).json({ success: false, error: null, message: 'Username/password is incorrect!', token: null });
            }
        });
    });
});

export default router;