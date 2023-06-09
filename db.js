const mongoose = require('mongoose');
require('dotenv').config();
mongoose.set("strictQuery", false);
const mongoURI = process.env.DATABASE

const connectToMongo = ()=>{
    mongoose.connect(mongoURI ,{
        useNewUrlParser : true,
    }).then(()=>{
        console.log("connection successful");
    }).catch((err)=>console.log("no connection"))
      
}

module.exports = connectToMongo;