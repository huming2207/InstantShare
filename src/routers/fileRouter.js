import { Router } from 'express'
import mongoose from 'mongoose'
import GistFile from '../models/GistFile';
import UserHelper from '../helpers/userHelper';

const router = Router();
const userHelper = new UserHelper();

router.post('/upload', (req, res) => {
    const token = req.headers['x-access-token'];
    let ownerId = "";
    if (!token) return res.status(401).json({ error: [ 'No token provided.' ], len: -1, id: null });

    try {
        ownerId = userHelper.verifyUser(token).id;
    } catch(error) {
        return res.status(500).json({ error: [ 'Failed to authenticate token.' ], len: -1, id: null  }); 
    }

    if (Object.keys(req.files).length == 0) {
        return res.status(400).json({ error: [ 'No file uploaded!' ], len: -1, id: null });
    }

    let uploadedFile = req.files.file;
    const fileHash = uploadedFile.md5();
    GistFile.create({
        owner: mongoose.Types.ObjectId(ObjectId),
        createdTime: new Date(), 
        hash: fileHash,
        fileName: uploadedFile.name,
        mimeType: uploadedFile.mimetype,
        private: false // TODO
    }, (err, file) => {
        uploadedFile.mv(process.env.UPLOAD_BASE_PATH + '/' + file._id, (err) => {
            if (err) return res.status(500).json({ error: [ 'Server cannot process the file', err ], id: null }); 
    
            res.status(200).json({ error: [], hash: fileHash, id: null });
        }); 
    });
});

router.get('/get/:fileId', (req, res) => {

});

export default router;