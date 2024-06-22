const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
const userRoute = require('./routes/userRoute')
dotenv.config();
app.use(cors());
app.use(express.json({ limit: "750mb" }));

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to Mongodb");
  })
  .catch((err) => {
    console.log("Error Connecting to Mongodb: ", err);
  });
app.listen(process.env.PORT, () => {
  console.log("server running on: ", process.env.PORT);
});

app.use('/api/user', userRoute);