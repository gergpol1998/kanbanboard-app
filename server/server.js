require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;


//handle CORS error
app.use(cors());


//set body bodyPasser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//connect db
app.listen(PORT, () => {
  mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log(`connection success and running at http://localhost:${PORT}`);
    })
    .catch((err) => {
      console.log(err);
    });
});

//Routes
const taskRoutes = require("./src/routers/task.routes");

app.use("/", taskRoutes);


