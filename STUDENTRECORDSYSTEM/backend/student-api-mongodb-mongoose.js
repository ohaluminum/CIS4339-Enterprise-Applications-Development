const express = require("express");

// Import mongoose library.
const mongoose = require("mongoose");

// Adding better logging functionality: can see who is making the request in the terminal.
const morgan = require("morgan");

// In the production systems, we should not hardcode the sensitive data like API Keys, Secret Tokens, etc 
// directly within the codebase (based on the Twelve factor App method). 
// We will pass them as environment variables. 
// This module helps us to load environment variables from a .env file into process.env.
require("dotenv").config();

const app = express();
app.use(express.json());    // Allows us to access request body as req.body
app.use(morgan("dev"));     // Enable incoming request logging in dev mode

// Import the student and grade model schema from another file.
let StudentModel = require('./models/student');
let GradeModel = require('./models/grade');

// Setting up mongoose DB connection.
mongoose
    .connect(process.env.MONGO_URL)       // Read environment varibale from .env file
    .then(() => {
        console.log("Database connection Success!");
    })
    .catch((err) => {
        console.error("Mongo Connection Error", err);
    });


// Declare the port number.
const PORT = process.env.PORT || 3000;


// POST(CREATE): an endpoint that will insert a student into a DB.
app.post('/student', (req, res, next) => {

    StudentModel.create(req.body, (error, data) => {
        if (error) {
            return next(error);
        }
        else {
          res.send('Student is added to the database');
        }
    });
});

 
// GET(READ): an endpoint to get all students from the API.
app.get('/students', (req, res, next) => {

    // The plain way to get all the data from the collection through the mongoose schema.
    StudentModel.find((error, data) => {

        if (error) {
            return next(error);      // Here we are using a call to next() to send an error message back
        } 
        else {
            res.json(data);
        }
    })
});


// GET(READ): an endpoint to retrieve specific student by student ID.
app.get('/student/:id', (req, res, next) => {
    StudentModel.findOne({ studentID: req.params.id}, (error, data) => {
        if (error) {
            return next(error);
        } 
        else if (data === null) {
            
            // Sending 404 when not found something is a good practice.
            res.status(404).send('Student not found');
        }
        else {
            res.json(data);
        }
    });
});


// PUT(Update): an endpoint to edit a student record by id.
app.put('/student/:id', (req, res, next) => {
    StudentModel.findOneAndUpdate({ studentID: req.params.id }, { $set: req.body }, (error, data) => {
        if (error) {
            return next(error);
        } 
        else {
            res.send('Student is edited via PUT.');
            console.log('Student successfully updated!', data)
        }
    })
});


// DELETE: an endpoint to delete a student by id.
app.delete('/student/:id', (req, res, next) => {
    // Mongoose will use studentID of document.
    StudentModel.findOneAndRemove({ studentID: req.params.id}, (error, data) => {
        if (error) {
            return next(error);
        } 
        else {
            res.status(200).json({
                msg: data
            });
        }
    });
});


// POST(CREATE): an endpoint that will insert a student grade into a DB.
app.post('/grade', (req, res, next) => {
    GradeModel.create(req.body, (error, data) => {
        if (error) {
            return next(error)
        } 
        else {
            res.send('Grade has been added to the database.');
        }
    });
});


// GET(READ): an endpoint to retrieve specific student grade by student ID.
app.get('/student-grade/:id', (req, res, next) => {
    GradeModel.find({ studentID: req.params.id }, (error, data) => {
        if (error) {
            return next(error)
        } 
        else {
            res.json(data);
        }
    });
});


app.listen(PORT, () => {
  console.log("Server started listening on port: ", PORT);
});


// Error handler
app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) 
        err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});