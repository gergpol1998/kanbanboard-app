const Task = require("../models/task.model");

//Get all tasks
const getAllTask = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

//Create a new task
const createTask = async (req, res) => {
    const { title, description, contact, Status } = req.body;

    try {
        const newTask = new Task({
            title,
            description,
            contact,
            Status,
        })

        await newTask.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

//Update a task
const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, contact, Status } = req.body;

    try {
        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.title = title;
        task.description = description;
        task.contact = contact;
        task.Status = Status;
        task.updatedAt = Date.now();

        await task.save();
        res.json(task);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }   
}

module.exports = {
    getAllTask,
    createTask,
    updateTask
}