const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')


const apiRoutes = require('./routes/apiRoutes')

dotenv.config()

mongoose.connect('mongodb+srv://gsousaaa:crawler123@crawler.3py7yry.mongodb.net/weather')
mongoose.Promise = global.Promise
mongoose.connection.on('error', (error) => {
    console.log(`erro: ${error.message}`)
})

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/', apiRoutes)

app.listen(process.env.PORT, () => {
    console.log(`Server rodando na porta ${process.env.PORT}`)
})