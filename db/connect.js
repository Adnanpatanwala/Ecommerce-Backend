const mongoose = require('mongoose');

const connectDB = (url) => {
  mongoose.set('strictQuery',false)
  return mongoose.connect(url).then(()=>console.log("connected to db"));
};

module.exports = connectDB;
