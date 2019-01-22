import { Router } from 'express'
import { check, validationResult } from 'express-validator/check'
import GistSnippet from '../../models/GistSnippet'
import { getUserToken } from '../../helpers/userHelper'

const router = Router();

router.post('/create', [
    check('name').isLength({ min: 3 }), check('content').isLength({ min: 1 })
], (req, res) => {
    const userResult = getUserToken(req);
    if(!userResult.passed) return res.status(userResult.statusCode).json({ success: false, message: userResult.message });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, error: errors.array(), message: 'Username/password is malformed', token: null });
    }

    GistSnippet.create({
        owner: userResult.decodedUser._id,
        createdTime: new Date(), 
        content: req.body.content,
        name: req.body.name
    }, (err, snippet) => {
        if(err || !snippet) return res.status(500).json({ success: false, message: err, error: null, name: null, id: null }); 
        return res.status(200).json({ success: true, message: null, name: snippet.name, error: null, id: snippet._id }); 
    });

});

export default router;