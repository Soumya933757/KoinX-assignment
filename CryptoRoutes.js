const express = require('express');
const { getDetails, getStats, getDeviation } = require('./CryptoController');
const route = express.Router();

route.get('/getDetails',getDetails)
route.get('/getStats/:coin',getStats)
route.get('/getDeviation/:coin',getDeviation)


module.exports = route;