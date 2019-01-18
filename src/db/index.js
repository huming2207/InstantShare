import mongoose from 'mongoose'

export const connect = () => {
    mongoose.connect('mongodb://' + process.env.DB_PATH, {
        useFindAndModify: true,
        useCreateIndex: true,
        useNewUrlParser: true, 
    });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Connection error:'));
    db.once('open', () => {
        console.log("Database connected!");
    });
}; 

export default connect;