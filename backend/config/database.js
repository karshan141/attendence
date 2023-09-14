const mongoose = require("mongoose");

require("dotenv").config();

const connectDb = () => {
  mongoose
    .connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log("Db Connected Successfully"))
    .catch((error) => {
      console.log("Db connection Issue");
      console.log(error);
      process.exit(1);
    });
};

module.exports = connectDb;
