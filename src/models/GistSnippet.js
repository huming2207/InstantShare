import { Schema, model } from 'mongoose'

const schema = new Schema({
    owner: { type: 'ObjectId', ref: 'user' },
    createdTime: { type: Date },
    tag: [{ type: String }],
    name: { type: String },
    content: { type: String },
    private: { type: Boolean }
});

export default model('gistsnippet', schema);