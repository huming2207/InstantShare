import { Schema, model } from 'mongoose'

const schema = new Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true, bcrypt: true, rounds: 10 },
    nickName: { type: String, required: true }
});

schema.plugin(require('mongoose-bcrypt'));

export default model('User', schema);