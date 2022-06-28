const express = require('express');
const { ObjectId } = require('mongodb');
const { connectToDb, getDb } = require('./db')

const app = express()
app.use(express.json())
let db

//db Connection
connectToDb((err) => {
    if (!err) {
        app.listen(3000, () => {
            console.log('App listening on port 3000')
        })
    }
    db = getDb()
})

app.get('/user', (req, res) => {
    const page = req.query.p || 0
    const userPerPage = 3

    let users = []

    db.collection('collection')
        .find()
        .sort({ name: 1 })
        .skip(page * userPerPage)
        .limit(userPerPage)
        .forEach(user => users.push(user))
        .then(() => {
            res.status(200).json(users)
        })
        .catch(() => {
            console.log(err)
            res.status(500).json({ error: "could not fetch the document" })
        })
})

app.get('/user/:id', (req, res) => {

    if (ObjectId.isValid(req.params.id)) {
        db.collection('collection')
            .findOne({ _id: ObjectId(req.params.id) })
            .then((doc) => {
                res.status(200).json(doc)
            })
            .catch(err => {
                res.status(500).json({ error: "Could not fetch document" })
            })
    } else {
        res.status(500).json({ error: 'Not a valid doc id' })
    }
})

app.post('/user', (req, res) => {
    const user = req.body;
    console.log(req.body)

    db.collection('collection')
        .insertOne(user)
        .then(result => {
            res.status(201).json(result)
        })
        .catch(err => {
            res.status(500).json({ error: "Could not create a new document" })
        })
})

app.delete('/user/:id', (req, res) => {

    if (ObjectId.isValid(req.params.id)) {
        db.collection('collection')
            .deleteOne({ _id: ObjectId(req.params.id) })
            .then((result) => {
                res.status(200).json(result)
            })
            .catch(err => {
                res.status(500).json({ error: "Could not delete document" })
            })
    } else {
        res.status(500).json({ error: 'Not a valid doc id' })
    }
})

app.patch('/user/:id', (req, res) => {

    const updates = req.body;

    if (ObjectId.isValid(req.params.id)) {
        db.collection('collection')
            .updateOne({ _id: ObjectId(req.params.id) }, {$set: updates})
            .then((result) => {
                res.status(200).json(result)
            })
            .catch(err => {
                res.status(500).json({ error: "Could not delete document" })
            })
    } else {
        res.status(500).json({ error: 'Not a valid doc id' })
    }
})