const express = require('express')
const app = express()
require("dotenv").config()
const bodyParser = require('body-parser')
const connectDB = require('./DB/mongoose')
const cors = require("cors")
const morgan = require("morgan")
const ListRouter = require('./DB/routes/list')
const TaskRouter = require('./DB/routes/task')
const UserRouter = require('./DB/routes/user')

app.use(bodyParser.json())
app.use(morgan("dev"))
app.use(cors())

app.use(ListRouter)
app.use(TaskRouter)
app.use(UserRouter)

app.listen(process.env.PORT, () => {
    connectDB()
    console.log('Server listening on port 5000')
})