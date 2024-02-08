require("./db/db")

const { index, create, update, destroy } = require("./controller")
const cors = require("cors")
const express = require("express")
const app = express()

app.use(express.json())
app.use(cors())

app.get("/todos", index)
app.post("/todos", create)
app.put("/todos/:id", update)
app.delete("/todos/:id", destroy)

app.listen(3001)
