const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://modi:harharmodi@cluster0.vstih.mongodb.net/skuad?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    console.log("MongoConnected");
  } catch (error) {
    console.error(error);
  }
};

let db = connectDB();

module.exports = db;
