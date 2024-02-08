const mongoose = require("mongoose")

const todoSchema = new mongoose.Schema({
  title: String,
  completed: Boolean,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
})

const Todo = mongoose.model("todos", todoSchema)

module.exports = Todo
