const Crypto = require('./CryptoModel')
const axios = require('axios')
const Agenda = require("agenda");

// can call normally to fetch the data
exports.getDetails = async(req,res)=>{
    try {
        const headers = {
          'Content-Type': 'application/json',
        }
       const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets',{headers:headers,
        params: {
            vs_currency: 'usd',
            ids:'bitcoin,ethereum,matic-network'
        }
       }) 
       
       response?.data?.forEach(async(coin) => {
        await Crypto.create({
            coin:coin.name,
            price:coin.current_price,
            marketCap:coin.market_cap,
            change:coin.price_change_24h
        })
       });
       return res.status(200).json({
        success:true,
        message:"Data Fetched",
        data:response.data
       })
    } catch (error) {
      res.status(500).json({
        success:false,
        message: "Failed to fetch data",
        error: error.message
      })  
    }
}

//In Every 2 hours the data will automatically fetch and stored
require("dotenv").config();
const agenda = new Agenda({ db: { address: process.env.MONGO_URL } });

agenda.define('fetchcrypto', async (job) => {
    try {
        const headers = {
            'Content-Type': 'application/json',
        };

        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
            headers: headers,
            params: {
                vs_currency: 'usd',
                ids: 'bitcoin,ethereum,matic-network'
            }
        });

        response?.data?.forEach(async (coin) => {
            await Crypto.create({
                coin: coin.name,
                price: coin.current_price,
                marketCap: coin.market_cap,
                change: coin.price_change_24h
            });
        });

        console.log('Crypto data fetched and saved successfully.');
    } catch (error) {
        console.error('Error fetching crypto data:', error.message);
    }
});
agenda.on('ready', async () => {
    await agenda.start();
    await agenda.every('2 hours', 'fetchcrypto');
});

exports.getStats = async(req,res)=>{
    try {
        const {coin} = req.params;
        const stats = await Crypto.find({coin:{ $regex: `^${coin}$`, $options: 'i' }},'coin marketCap change price').sort({createdAt:-1});
        return res.status(200).json({
            success:true,
            message:"Stats Fetched",
            data:stats[0]
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: "Failed to fetch stats",
            error: error.message
        })
    }
}

exports.getDeviation = async(req,res)=>{
    try {
        const {coin} = req.params;
        const records = await Crypto.find({coin:{$regex: `^${coin}$`, $options: 'i'}}).sort({createdAt:-1}).limit(100)

        const prices = records.map(record => record.price);
        const mean = prices.reduce((acc, price) => acc + price, 0) / prices.length;
        const variance = prices.reduce((acc, price) => acc + Math.pow(price - mean, 2), 0) / prices.length;
        const standardDeviation = Math.sqrt(variance);

        return res.status(200).json({
            success:true,
            message:"Devaition",
            data:{
                devaition:standardDeviation
            }
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: "Failed to found devaition",
            error: error.message
        })
    }
}