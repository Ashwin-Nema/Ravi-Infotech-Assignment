const mongoose = require('mongoose')
require('dotenv').config()
const { MONGODB_URL} = process.env
function DatabaseConnection () {
    mongoose.connect(MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, async (err) => {
        if (err) throw err
        console.log("connected")
    })
}

module.exports = DatabaseConnection