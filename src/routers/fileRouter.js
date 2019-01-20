import { Router } from 'express'
import mongoose from 'mongoose'
import GistFile from '../models/GistFile';
import UserHelper from '../helpers/userHelper';

const router = Router();
const userHelper = UserHelper;
const uploadDir = process.env.UPLOAD_BASE_PATH + '/'

router.post('/upload', (req, res) => {
    const token = req.headers['x-access-token'];
    let ownerId = "";
    if (!token) return res.status(401).json({ error: [ 'No token provided.' ], hash: null, id: null });

    try {
        ownerId = userHelper.verifyUser(token).id;
    } catch(error) {
        return res.status(500).json({ error: [ 'Failed to authenticate token.' ], hash: null, id: null  }); 
    }

    if (Object.keys(req.files).length == 0) {
        return res.status(400).json({ error: [ 'No file uploaded!' ], hash: null, id: null });
    }

    let uploadedFile = req.files.file;
    const fileHash = uploadedFile.md5();
    GistFile.create({
        owner: mongoose.Types.ObjectId(ownerId),
        createdTime: new Date(), 
        hash: fileHash,
        fileName: uploadedFile.name,
        mimeType: uploadedFile.mimetype,
        private: false, // TODO
        length: uploadedFile.data.length
    }, (err, file) => {

        // When file document in the DB is created, go on moving the file to the storage space
        uploadedFile.mv(uploadDir + file._id, (err) => {
            if (err) return res.status(500).json({ error: [ 'Server cannot process the file', err ], hash: null, len: -1 }); 
            res.status(200).json({ error: [], hash: fileHash, len: uploadedFile.data.length });
        }); 
    });
});

router.get('/get/:fileId', (req, res) => {
    const fileId = req.params.fileId;
    const isDown = typeof(req.query.dl) !== undefined
    GistFile.findById(fileId, (err, file) => {
        if(isDown) {
            res.type(file.mimeType).download(uploadDir + file._id, file.fileName);
        } else {
            res.type(file.mimeType).sendFile(uploadDir + file._id);
        }
    });
});

export default router;