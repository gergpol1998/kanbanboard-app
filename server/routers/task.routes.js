const express = require("express");
const router = express.Router();
const taskController = require("../controllers/task.controller");

//Get all tasks
router.get("/",taskController.getAllTask);

//Create a new task
router.post("/create",taskController.createTask);

//Update a task
router.put("/update/:id",taskController.updateTask);

module.exports = router;