const express = require("express");
const router = express.Router();
const Task = require("../models/task");

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();

    res.json(tasks);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Error fetching tasks",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const newTask = new Task(req.body);

    await newTask.save();

    res.json({
      message: "Task added successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Error saving task",
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        text: req.body.text,
        completed: req.body.completed,
      },
      { new: true },
    );

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);

    res.json({
      message: "Task deleted",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Error deleting task",
    });
  }
});

module.exports = router;
