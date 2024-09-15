const express = require("express");
const dotenv = require('dotenv');
const { default: mongoose } = require("mongoose");
dotenv.config()

const app = express()
const port = process.env.PORT || 3001 

app.get('/', (req, res) =>{
    res.send('Hello')
})

mongoose.connect(`mongodb+srv://ngocduyxx1508:${process.env.MONGO_DB}@cluster0.2mkxj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
.then(()=> {
    console.log('Conect DB success')
})
.catch((err) =>{
    console.log(err)
})

app.listen(port, ()=>{
    console.log('Sever is running in port', + port)
})