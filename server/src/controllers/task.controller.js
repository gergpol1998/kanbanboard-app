const Task = require("../models/task.model");

//Get all Task
const getAllTask = async (req, res) => {
    try {
        const Tasks = await Task.find();
        res.json(Tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

//Create a new Task
const createTask = async (req, res) => {
    const { title, description, contact, status } = req.body;

    try {
        const newTask = new Task({
            title,
            description,
            contact,
            status,
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
    const { status } = req.body;

    try {
        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.status = status;
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
