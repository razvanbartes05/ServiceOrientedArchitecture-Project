const http = require("http")
const express = require("express")
const socketIO = require("socket.io")
const cors = require("cors")
const amqp = require("amqplib/callback_api")
const { Server } = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*",
  },
})

app.use(express.json())
app.use(cors({
  origin: "*"
}))


const send = async (title, action) => {
  if (action == "create")
    io.emit("notification", { message: `A new item has been added: ${title}` })
  if (action == "update_marked")
    io.emit("notification", { message: `This item has been purchased: ${title}` })
  if (action == "update_unmarked")
    io.emit("notification", { message: `This item has not been purchased: ${title}` })

  if (action == "delete")
    io.emit("notification", { message: `Item deleted: ${title}` })
}

amqp.connect("amqp://localhost", function (error0, connection) {
  connection.createChannel(function (error1, channel) {
    var create_queue = "notifications_create"
    var delete_queue = "notifications_delete"
    var update_queue_marked = "notifications_update_marked"
    var update_queue_unmarked = "notifications_update_unmarked"

    channel.assertQueue(create_queue, {
      durable: false,
    })
    channel.assertQueue(delete_queue, {
      durable: false,
    })
    channel.assertQueue(update_queue_marked, {
      durable: false,
    })
    channel.assertQueue(update_queue_unmarked, {
      durable: false,
    })

    channel.consume(
      create_queue,
      async (msg) => {
        const title = msg.content.toString()
        send(title, "create")
      },
      {
        noAck: true,
      }
    )
    channel.consume(
      update_queue_marked,
      async (msg) => {
        const title = msg.content.toString()
        send(title, "update_marked")
      },
      {
        noAck: true,
      }
    )
    channel.consume(
      delete_queue,
      async (msg) => {
        const title = msg.content.toString()
        send(title, "delete")
      },
      {
        noAck: true,
      }
    )
    channel.consume(
      update_queue_unmarked,
      async (msg) => {
        const title = msg.content.toString()
        send(title, "update_unmarked")
      },
      {
        noAck: true,
      }
    )
  })
})

server.listen(3002)

io.on("connection", (socket) => {
  console.log("A user connected")

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected")
  })

  // Emit a notification event to the connected client
  socket.emit("notification", "Hello, this is a notification!")
})
