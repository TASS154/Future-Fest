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

app.get('/sobrenos', (req, res) => {
    res.sendFile(__dirname + '/HTML/sobrenos.html')
})

app.get('/planos', (req, res) => {
    res.sendFile(__dirname + '/HTML/planos.html')
})

app.get('/loja', (req, res) => {
    res.sendFile(__dirname + '/HTML/loja.html')
})

app.get('/B-corp', (req, res) => {
    res.sendFile(__dirname + '/HTML/B-corp.html')
})

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/HTML/login.html')
})

app.get('/cursos', (req, res) => {
    res.sendFile(__dirname + '/HTML/cursos.html')
})

app.get('/pp', (req, res) => {
    res.sendFile(__dirname + '/HTML/pp.html')
})

app.get('/termos', (req, res) => {
    res.sendFile(__dirname + '/HTML/termos.html')
})


app.get('/email', (req, res) => {
    res.sendFile(__dirname + '/HTML/email.html')
})




app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})