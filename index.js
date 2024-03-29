const connectToMongo = require('./db');
const express = require('express')
const cors = require('cors')
require('dotenv').config();

connectToMongo();
const app = express()
const PORT =  5000 || process.env.PORT

app.use(cors())
app.use(express.json())

// Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))


app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})