const mongoose = require('mongoose');

const products =  mongoose.Schema({
        name: String,
        description: String,
        price: Number,
        image: String
})

module.exports = mongoose.model("products", products)