const express = require('express');
const app = express();
require("dotenv").config();
app.use(express.json());
const {connectDatabase} = require('./DatabaseConfig')
connectDatabase();
const cryptoRoutes = require('./CryptoRoutes')
app.use('/api/v1',cryptoRoutes)
app.listen(process.env.PORT,()=>{
    console.log("server is listening...")
})