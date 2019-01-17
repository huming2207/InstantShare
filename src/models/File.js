import { Schema, model } from 'mongoose'

const schema = new Schema({
    owner: { type: 'ObjectId', ref: 'User' }
});

export default model('File', schema);