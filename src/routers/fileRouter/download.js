import { Router } from 'express'
import GistFile from '../../models/GistFile'
import dotenv from 'dotenv'

dotenv.config({ path: __dirname + '/../../../.env' });

const router = Router();
const uploadDir = process.env.UPLOAD_BASE_PATH + '/';

router.get('/f/:hash', (req, res) => {
    const hash = req.params.hash;
    const isDown = (typeof(req.query.dl) !== undefined);

    if(!hash) return res.status(404).type('text/plain').send('Not found');

    GistFile.findOne({ hash: hash }, (err, file) => {
        if(isDown) {
            res.download(uploadDir + file._id, file.fileName);
        } else {
            res.sendFile(uploadDir + file._id);
        }
    });
});

export default router;