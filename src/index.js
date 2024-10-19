'use strict'
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoClient } = require("mongodb");
require('dotenv').config();


//settings
const port = process.env.PORT || 3001;
app.set('json spaces', 2);

//mongodb connect
const uri = process.env.Mongo_uri;
//const uri = "mongodb://192.168.6.215:27017";

mongoose.Promise = global.Promise;
mongoose.connect(uri).then(db => console.log('conexion exitosa')).catch(err => console.log('error: ', err));

const client = new MongoClient(uri);

async function run() {
    try {
        const database = client.db('sample');
        const data = database.collection('data');
    } finally {
        await client.close();
    }
}

run().catch(console.dir);


//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

//routes
app.use(require('./routes/index'));

//starting the server
app.listen(port, () => {
    console.log('Server listening on port ' + port)
})
