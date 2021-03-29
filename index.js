const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hcopb.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;

const app = express()
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())


const port = 5000;


console.log(process.env.DB_USER);   //.evn check



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db("emaJohnStore").collection("products");
    const odersCollection = client.db("emaJohnStore").collection("oders");

    app.post('/addProduct', (req, res) => {
        const products = req.body;
        productsCollection.insertOne(products)
            .then(result => {
                console.log(result);
                res.send(result.inserCount);
            })
    })


    app.get('/products', (req, res) => {
        productsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })



    app.get('/product/:key', (req, res) => {
        productsCollection.find({ key: req.params.key })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })


    app.post('/productsByKeys', (req, res) => {
        const productKeys = req.body;
        productsCollection.find({ key: { $in: productKeys } })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })



    app.post('/addOder', (req, res) => {
        const oder = req.body;
        odersCollection.insertOne(oder)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })



});


app.listen(port)