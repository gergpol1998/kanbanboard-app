const express = require("express");
const router = express.Router();
const taskController = require("../controllers/task.controller");

//Get all tickets
router.get("/task",taskController.getAllTask);

//Create a new ticket
router.post("/task/create",taskController.createTask);

//Update a task
router.put("/task/update/:id",taskController.updateTask);


module.exports = router;