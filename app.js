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
                expiresIn: "2h"
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
app.post('/login',async (req,res) => {
    // Our login logic starts here
    try{
        // Get user input
        const { email, password } = req.body;

        // Validate User Input
        if(!(email && password)){
            res.status(400).send("All Inputs are required!");
        }

        // Validate if User exist in our database
        const user = await User.findOne({email});

        if(user && (await bcrypt.compare(password,user.password))){
            // create token
            const token = jwt.sign(
                { user_id: user._id },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h"
                }
            );

            // save token
            user.token = token;

            // user
            res.status(200).json(user);
    
        }
        res.status(400).send("Invalid Credentials!");

    }
    catch(err){
        console.log(err);
    }

    // Our login logic ends here
});


module.exports = app;
