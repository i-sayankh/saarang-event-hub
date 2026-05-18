const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors({ origin: 'https://saarang-event-hub.vercel.app' }))
app.use(express.json())
app.use('/api/auth',require('./routes/auth'))
app.use('/api/events',require('./routes/events'))

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err))

app.get('/', (req, res) => {
  res.send('Saarang API is running')
})

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})