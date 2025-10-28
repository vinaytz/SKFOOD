const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    id: String,
    name: String,
    description: String,
    price: Number,
    image: String
})

const users =  mongoose.Schema({
    name:String,
    email:{
        type:String,
        require:true,   
        unique:true
    },
    password:String,
    googleId:String,
    picture:String,
    orders: [orderSchema]
})

module.exports = mongoose.model("users", users)