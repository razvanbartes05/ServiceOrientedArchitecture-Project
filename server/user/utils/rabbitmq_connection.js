const User = require("../db/user")
const amqp = require("amqplib/callback_api")

amqp.connect("amqp://localhost", function (error0, connection) {
  if (error0) {
    throw error0
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1
    }

    channel.assertQueue("user_check", {
      durable: false,
    })
    channel.assertQueue("user_check_response", {
      durable: false,
    })

    console.log(
      "User service: Waiting for messages in %s. To exit press CTRL+C",
      "user_check"
    )

    channel.consume(
      "user_check",
      async (msg) => {
        User.findById(msg.content.toString())
          .then((e) => {
            channel.sendToQueue(
              "user_check_response",
              Buffer.from(JSON.stringify(true))
            )
          })
          .catch(() => {
            channel.sendToQueue(
              "user_auth_response",
              Buffer.from(JSON.stringify(false))
            )
          })
      },
      {
        noAck: true,
      }
    )
  })
})
