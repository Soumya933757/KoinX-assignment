const mongoose = require('mongoose');
require("dotenv").config()

exports.connectDatabase = async()=>{ 
await mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("database connected"))
.catch((err)=>{console.log(err)
    process.exit(1);
})}