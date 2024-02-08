const mongoose = require("mongoose")

mongoose.connect(
  "mongodb+srv://razvanbartes2000:GPRqK2JC2F0dAmpe@cluster0.7eyl4hx.mongodb.net/?retryWrites=true&w=majority"
)
mongoose.set("debug", (collectionName, method, query, doc) => {
  console.log(`${collectionName}.${method}`, JSON.stringify(query), doc)
})
