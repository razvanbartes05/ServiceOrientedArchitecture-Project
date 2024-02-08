const jwt = require("jsonwebtoken")
const User = require("./db/user")

const index = async (_, res) => {
  console.log("asd")
  const users = await User.find({})
  res.send(users)
}

const login = async (req, res) => {
  const { name } = req?.body || {}
  console.log(name)
  const users = await User.find({})
  console.log(users)
  const user = await User.findOne({ name: name })
  console.log(user)

  await User.create({ name: 'Pop' })

  if (user) {
    const token = jwt.sign({ id: user.id }, "very_secret_key")

    console.log(token)
    res.json({ token: token })

  } else {
    res.send({ message: "Authentication failed" })
  }
}

module.exports = {
  index,
  login,
}
