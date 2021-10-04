require('dotenv').config();
require('./config/database').connect();
const express = require('express');
const User = require('./model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());

// Logic goes here

// Register here
app.post('/register', async (req,res) => {
    // our register logic goes here
    try {
        // Get user Input
        const { first_name, last_name, email, password } = req.body;

        // validate user Input
        if(!(email && password && first_name && last_name)){
            res.status(400).send('All Inputs are required!');
        }

        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await User.findOne({email});

        if(oldUser){
            res.status(409).send('User already exist! Please Login.');
        }

        // encrypt user password
        encryptedPass = await bcrypt.hash(password,10);

        // Create user in our database
        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPass
        });

        // Create token
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "1m"
            }
        );
        // save user token
        user.token = token;

        // return new user
        res.status(401).json(user);


    }
    catch(err){
        console.log(err);
    }
    // Our register logic ends 
});

// Login here
app.post('/login',(req,res) => {

})


module.exports = app;
