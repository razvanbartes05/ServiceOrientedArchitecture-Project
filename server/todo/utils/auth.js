const jwt = require("jsonwebtoken")
const amqp = require("amqplib/callback_api")

const authenticated = (req, res) => {
  const authHeader = req.headers["authorization"]
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1]
    let decoded_token
    try {
      decoded_token = jwt.verify(token, "very_secret_key")
    } catch (err) {
      res.send({ message: "Not authorized" })
      return
    }
    const user_id = decoded_token.id
    // have user_id check now if the user exists
    amqp.connect("amqp://localhost", function (error0, connection) {
      connection.createChannel(function (error1, channel) {
        var queue = "user_check"

        channel.assertQueue(queue, {
          durable: false,
        })
        channel.assertQueue("user_check_response", {
          durable: false,
        })

        channel.sendToQueue(queue, Buffer.from(user_id))
        channel.consume(
          "user_check_response",
          async (msg) => {
            if (msg.content.toString() != "true") {
              res.send({ message: "Not authorized" })
              return
            }
          },
          {
            noAck: true,
          }
        )
      })
    })

    return true
  }

  res.send({ message: "Not authorized" })
  return
}

const userIdAuth = (req) => {
  const authHeader = req.headers["authorization"]
  if (!authHeader) {
    return
  }
  const token = authHeader.split(" ")[1]

  try {
    decoded_token = jwt.verify(token, "very_secret_key")
  } catch (err) {
    return
  }

  const user_id = decoded_token.id

  return user_id
}

module.exports = {
  authenticated,
  userIdAuth,
}
