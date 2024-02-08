require("./db/db")
require("./utils/rabbitmq_connection")

const express = require("express")
const cors = require("cors")
const app = express()
const { login, index } = require("./controller")

app.use(express.json())
app.use(cors())

app.post("/login", login)
app.get("/users", index)

app.listen(3000)
