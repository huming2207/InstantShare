import { Schema, model } from 'mongoose'

const schema = new Schema({
    owner: { type: 'ObjectId', ref: 'user' },
    createdTime: { type: Date },
    tag: [{ type: String }],
    mimeType: { type: String },
    hash: { type: String },
    fileName: { type: String },
    private: { type: Boolean }
});

export default model('gistfile', schema);