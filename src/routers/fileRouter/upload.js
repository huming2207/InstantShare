import { Router } from 'express'
import GistFile from '../../models/GistFile';
import { getUserToken } from '../../helpers/userHelper'
import dotenv from 'dotenv'

dotenv.config({ path: __dirname + '/../../../.env' });

const router = Router();
const uploadDir = process.env.UPLOAD_BASE_PATH + '/';

router.post('/upload', (req, res) => {
    const userResult = getUserToken(req);
    if(!userResult.passed) return res.status(userResult.statusCode).json({ success: false, message: userResult.message });

    if (Object.keys(req.files).length == 0) {
        return res.status(400).json({ success: false, message: 'No file specified!', hash: null, id: null });
    }

    let uploadedFile = req.files.file;

    if(!uploadedFile) {
        return res.status(400).json({ success: false, message: 'File is not selected!', hash: null, id: null });
    }

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

        // If upload fails, return 500
        if(err || !file) return res.status(500).json({ success: false, message: 'Failed to create database record!', error: err, hash: null, id: null }); 

        // When file document in the DB is created, go on moving the file to the storage space
        uploadedFile.mv(uploadDir + file._id, (err) => {
            if(err) return res.status(500).json({ success: false, message: 'Failed to store the file', error: err, hash: null, id: null }); 
            res.status(200).json({ success: true, message: 'File uploaded!', hash: fileHash, id: file._id });
        }); 
    });
});

export default router;