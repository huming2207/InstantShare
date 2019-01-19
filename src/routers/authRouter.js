import { Router } from 'express'
import User from '../models/User'
import UserHelper from '../helpers/userHelper';

const router = Router();
const userHelper = new UserHelper();

router.post('/register', (req, res) => {
    User.create({
        email: req.body.email,
        password: req.body.password,
        nickName: req.body.nickName
    }, (err, user) => {
        if(err) return res.status(500).json({ auth: false, token: null, error: [ "Failed to register user, internal server error" ] });

        const token = userHelper.signUser(user._id);
        return res.status(200).send({ auth: true, token: token, error: [] });
    });
});

router.get('/me', (req, res) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).json({ auth: false, error: [ 'No token provided.' ], user: null});

    try {
        const decoded = userHelper.verifyUser(token);
        res.status(200).json({ auth: true, error: [], user: decoded });
    } catch(error) {
        return res.status(500).json({ auth: false, error: [ 'Failed to authenticate token.' ], user: null }); 
    }
});

router.post('/login', (req, res) => {
    
    if(typeof req.body.email === 'undefined' || typeof req.body.password === 'undefined') {
        res.status(400).json({ auth: false, error: [ "Username/password is not provided" ], token: null});
    }

    User.findOne({ email: req.body.email }, (err, user) => {
        if(err) {
            return res.status(500).json({ auth: false, error: [ "Unknown server error" ], token: null });
        }

        if(!user) {
            return res.status(401).json({ auth: false, error: [ "Username/Password incorrect!" ], token: null });
        }

        user.verifyPassword(req.body.password, (err, same) => {
            if(err) {
                return res.status(401).json({ auth: false, error: [ "Username/Password incorrect!" ], token: null});
            }

            if(same) {
                const token = userHelper.signUser(user._id);
                return res.status(200).json({ auth: true, error: [], token: token });
            } else {
                return res.status(401).json({ auth: false, error: [ "Username/Password incorrect!" ], token: null});
            }
        });
    });
});

export default router;