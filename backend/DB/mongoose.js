const mongoose = require('mongoose')

const connectDB = () => mongoose.connect(process.env.DB_URL).then(() => {
    console.log('Connected to Mongo DB Successfully')
}).catch((err) => {
    console.log('Error in making DB Connection:', err)
})

module.exports = connectDB