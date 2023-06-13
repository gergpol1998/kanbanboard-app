require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}))

//connect db
app.listen(PORT, () => {
    mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://gergpol:gergpol123@cluster0.zc50uva.mongodb.net/', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => {
            console.log(`connection success and running at port ${PORT}`);
        })
        .catch((err) => {
            console.log(err);
        })
})

//Routes
const taskRoutes = require("../routers/task.routes");
app.use("/",taskRoutes);