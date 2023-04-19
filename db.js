const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://devang:devangpatel@cluster0.xiq0jsm.mongodb.net/inotebooks?retryWrites=true&w=majority"



const connectToMongo = ()=>{
    mongoose.connect(mongoURI).then(()=>{
        console.log("connection successful");
    }).catch((err)=>console.log("no connection"))
      
}

module.exports = connectToMongo;