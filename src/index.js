import express from 'express'
import db from './db'

require('dotenv').config();
db();

const app = express();

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(process.env.SERV_PORT, () => {
    console.log(`App listening on port ${process.env.SERV_PORT}!`);
});