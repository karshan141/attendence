const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

app.use(express.json());

require("dotenv").config();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server started Successfully on port no ${PORT}`);
});

// test route for react app
app.get("/", (req, res) => {
  res.send("Starter pack build successfuly 123");
});



const database = require("./config/database");
database.connect();

const User = require("./models/User");



// /*---- add Test admin in user collections

// const newUser = new User({
//   username: "admin",
//   password: "12345",
//   role: "superAdmin",
// });

// newUser.save().then((err, data) => {
//   if (!err) {
//     console.log(data);
//     res.send(data);
//   }
// }); ------- */




