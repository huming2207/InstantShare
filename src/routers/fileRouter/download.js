import { Router } from 'express'
import GistFile from '../../models/GistFile'
import dotenv from 'dotenv'

dotenv.config({ path: __dirname + '/../../../.env' });

const router = Router();
const uploadDir = process.env.UPLOAD_BASE_PATH + '/';

router.get('/f/:id', (req, res) => {
    const id = req.params.id;
    const isDown = (Object.keys(req.query).length === 0);

    if(!id) return res.status(422).send('No ID parameter is specified');

    GistFile.findOne({ id: id }, (err, file) => {
        if(err) res.status(500).send('Internal server error');
        if(!file) res.status(404).send('Cannot find your file!');
        if(isDown) {
            res.download(uploadDir + file._id, file.fileName);
        } else {
            res.sendFile(uploadDir + file._id);
        }
    });
});

export default router;