const express = require("express")
const cors = require("cors")
const authRoute = require("../routes/authRoute")
const categoryRoute = require("../routes/categoryRoute")
const propertyRoute = require("../routes/propertyRoute")
const roomRoute = require("../routes/roomRoute")
const statusRoute = require("../routes/statusRoute")
const ordersRoute = require("../routes/ordersRoute")

const PORT = process.env.PORT || 8000

const app = express()
app.use(cors())
app.use(express.json())

app.use("/public", express.static("public"))

app.use("/auth", authRoute)
app.use("/category", categoryRoute)
app.use("/property", propertyRoute)
app.use("/room", roomRoute)
app.use("/status", statusRoute)
app.use("/order", ordersRoute)

app.listen(PORT, (err) => {
  console.log(`SERVER RUNING on Port ${PORT}`)
  if (err) {
    console.log(`ERROR: ${err}`)
  }
})
