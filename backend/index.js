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


const connectDb = require("./config/database");
connectDb();
