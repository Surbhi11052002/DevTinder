const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://surbhiprasad:2Acvs5D47OifYy2s@surbhi.pdv6gf7.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
