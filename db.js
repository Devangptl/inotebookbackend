const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
require('dotenv').config();
const mongoURI = process.env.DATABASE



const connectToMongo = ()=>{
    mongoose.connect(mongoURI).then(()=>{
        console.log("connection successful");
    }).catch((err)=>console.log("no connection"))
      
}

module.exports = connectToMongo;