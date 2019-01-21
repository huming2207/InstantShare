import { Router } from 'express'
import GistFile from '../models/GistFile';
import { getUserToken } from '../helpers/userHelper'
import dotenv from 'dotenv'

dotenv.config({ path: __dirname + '/../../.env' });

const router = Router();
const uploadDir = process.env.UPLOAD_BASE_PATH + '/';

router.post('/upload', (req, res) => {
    const userResult = getUserToken(req);
    if(!userResult.passed) return res.status(userResult.statusCode).json({ success: false, message: userResult.message });

    if (Object.keys(req.files).length == 0) {
        return res.status(400).json({ error: [ 'No file uploaded!' ], hash: null, id: null });
    }

    console.log(req.files);
    let uploadedFile = req.files.file;
    const fileHash = uploadedFile.md5();
    GistFile.create({
        owner: userResult.decodedUser._id,
        createdTime: new Date(), 
        hash: fileHash,
        fileName: uploadedFile.name,
        mimeType: uploadedFile.mimetype,
        private: false, // TODO
        length: uploadedFile.data.length
    }, (err, file) => {

        // When file document in the DB is created, go on moving the file to the storage space
        uploadedFile.mv(uploadDir + file._id, (err) => {
            if (err) return res.status(500).json({ success: false, message: err, hash: null, len: -1 }); 
            res.status(200).json({ success: true, message: err, hash: fileHash, len: uploadedFile.data.length });
        }); 
    });
});

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