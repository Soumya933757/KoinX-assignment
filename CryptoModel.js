const mongoose = require('mongoose')
const cryptoSchema = new mongoose.Schema({
    coin:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    marketCap:{
        type:Number,
        required:true
    },
    change:{
        type:Number,
        required:true
    }
},{timestamps:true})

module.exports = mongoose.model('Crypto', cryptoSchema)