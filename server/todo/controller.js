const { authenticated, userIdAuth } = require("./utils/auth")
const amqp = require("amqplib/callback_api")
const Todo = require("./db/todo")

const index = async (req, res) => {
  authenticated(req, res)

  const user_id = userIdAuth(req)
  const todos = await Todo.find({ userId: user_id })
  if (!res.headersSent) res.send(todos)
}

const create = async (req, res) => {
  authenticated(req, res)

  let { title } = req?.body
  const user_id = userIdAuth(req)

  if (title == undefined || title == "") title = "empty"
  const todo = await Todo.create({
    title: title,
    completed: false,
    userId: user_id,
  })

  amqp.connect("amqp://localhost", function (error0, connection) {
    console.log(connection)
    console.log(error0)
    connection.createChannel(function (error1, channel) {
      var queue = "notifications_create"

      channel.assertQueue(queue, {
        durable: false,
      })

      channel.sendToQueue(queue, Buffer.from(title))
    })
  })
  if (!res.headersSent) res.send(todo)
}

const update = async (req, res) => {
  authenticated(req, res)

  const id = req.params.id
  const { completed } = req.body
  const todo = await Todo.findOne({ _id: id })
  await Todo.updateOne({ _id: id }, { completed: completed })

  amqp.connect("amqp://localhost", function (error0, connection) {
    connection.createChannel(function (error1, channel) {
      let queue
      if (completed == true) queue = "notifications_update_marked"
      else queue = "notifications_update_unmarked"

      channel.assertQueue(queue, {
        durable: false,
      })

      channel.sendToQueue(queue, Buffer.from(todo.title))
    })
  })
  if (!res.headersSent) res.send(200)
}

const destroy = async (req, res) => {
  authenticated(req, res)

  const id = req.params.id
  const todo = await Todo.findOne({ _id: id })
  await Todo.deleteOne({ _id: id })

  amqp.connect("amqp://localhost", function (error0, connection) {
    connection.createChannel(function (error1, channel) {
      var queue = "notifications_delete"

      channel.assertQueue(queue, {
        durable: false,
      })

      channel.sendToQueue(queue, Buffer.from(todo.title))
    })
  })
  if (!res.headersSent) res.send(200)
}

module.exports = {
  index,
  create,
  update,
  destroy,
}
