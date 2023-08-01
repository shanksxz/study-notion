const mongoose = require('mongoose');
require('dotenv').config();

exports.connect = () => {
    mongoose.connect(process.env.MONGDB_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then( () => console.log("db connected successfully"))
    .catch((err)=>{
        console.log("err in mongodb connection",err);
        process.exit(1);
    })
}