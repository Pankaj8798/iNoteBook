const connectToMongo = require("./db");
require('dotenv').config()
connectToMongo();

const express = require('express')
const cors = require('cors')
const upload = require('express-fileupload');
const app = express()
const port = 5000

app.use(cors())

// Available middleware
app.use(express.json())

// File upload
app.use(upload())

// Available routes
app.use('/api', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
    console.log(`iNotebook backend server is running on http://localhost:${port}`)
})