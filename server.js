const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const path = require('path')
const port = 3000;
const methodOverride = require('method-override');
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(methodOverride('_method'));

const url = 'mongodb://127.0.0.1:27017/';
const dbName = 'academia';
const collection = 'alunos';

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/HTML/index.html')
})

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})