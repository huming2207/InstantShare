import { Schema, model } from 'mongoose'

const schema = new Schema({
    owner: { type: 'ObjectId', ref: 'user' },
    createdTime: { type: Date },
    tag: [{ type: String }],
    name: { type: String }
});

export default model('gistcode', schema);