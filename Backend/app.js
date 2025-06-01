const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const connectToDB = require('./db/db');
const userRoutes = require('./routes/user.routes');
const captainRoutes = require('./routes/captain.routes');
// Importing necessary modules and initializing the Express application

connectToDB(); // Connect to the database

app.use(cors());    
app.use(cookieParser()); // Middleware to parse cookies


app.get('/', (req, res)=>{
    res.send('Hello World')
});

app.use(express.json()); // Middleware to parse JSON requests
app.use('/users', userRoutes); // Setting up user routes
app.use('/captains', captainRoutes); // Setting up captain routes

module.exports = app;
// This is the main application file for the backend server.