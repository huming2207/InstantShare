import { Router } from 'express'
import User from '../models/User'
import jwt from 'jsonwebtoken'

const router = Router();

router.post('/register', (req, res) => {
    User.create({
        email: req.body.email,
        password: req.body.password,
        nickName: req.body.nickName
    }, (err, user) => {
        if(err) res.status(500).json({
            auth: false,
            token: null,
            error: [ "Failed to register user, internal server error" ] 
        });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: 3600
        });

        res.status(200).send({ 
            auth: true, 
            token: token,
            error: []
        });
    });
});

router.get('/me', function(req, res) {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, error: [ 'No token provided.' ]});
    
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
        if (err) {
            return res.status(500).send({ 
                auth: false, 
                error: [ 'Failed to authenticate token.' ]
            });     
        }
      
        res.status(200).send(decoded);
    });
});