require('dotenv').config();
require('./config/database').connect();
const express = require('express');
const user = require('./model/user');

const app = express();

app.use(express.json());

// Logic goes here

// Register here
app.post('/register',(req,res) => {

})

// Login here
app.post('/login',(req,res) => {

})





module.exports = app;