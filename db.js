const { MongoClient } = require('mongodb');

let dbConnection

module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect('mongodb+srv://rannith:Rannith2022@cluster0.pwqs8.mongodb.net/Sample?retryWrites=true&w=majority')
        .then((client) => {
            console.log("db conncted")
            dbConnection = client.db()
            return cb()
        })
        .catch((err) => {
            console.log(err)
            return cb(err)
        })
    },
    getDb: () => dbConnection
}