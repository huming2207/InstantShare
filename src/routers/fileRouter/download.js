import { Router } from 'express'
import GistFile from '../../models/GistFile'
import dotenv from 'dotenv'

dotenv.config({ path: __dirname + '/../../../.env' });

const router = Router();
const uploadDir = process.env.UPLOAD_BASE_PATH + '/';

router.get('/f/:id', (req, res) => {
    const id = req.params.id;
    const isDown = (Object.keys(req.query).length !== 0);

    if(!id) return res.status(422).send('No ID parameter is specified');

    GistFile.findById(id, (err, file) => {
        if(err) return res.status(500).send('Internal server error');
        if(!file) return res.status(404).send('Cannot find your file!');
        if(isDown) {
            return res.download(uploadDir + file._id, file.fileName); // No need to set MIME type here, octet stream is fine
        } else {
            return res.type(file.mimeType).sendFile(uploadDir + file._id);
        }
    });
});

export default router;