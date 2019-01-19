import express from 'express'
import bodyParser from 'body-parser'
import db from './db'
import router from './routers';

require('dotenv').config();
db();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api', router);

app.listen({host: process.env.SERV_HOST, port: process.env.SERV_PORT}, () => {
    console.log(`App listening on port ${process.env.SERV_PORT}!`);
});