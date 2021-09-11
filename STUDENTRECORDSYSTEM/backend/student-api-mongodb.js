const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;     // Database driver  

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const port = 3000;

// This variable is our connection to the DB - a MongoDB client.
let studentsDB;

// StudentRecords - The name of the database.
let connectionString = 'mongodb://localhost:27017/StudentRecords';

// Set-up connection:
MongoClient.connect(
    connectionString, { 
        useNewUrlParser: true, useUnifiedTopology: true 
    },
    function (err, client) {
        studentsDB = client.db();
        app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));
    }
    // Reference: https://mongodb.github.io/node-mongodb-native/api-generated/mongoclient.html
    
    // Method connect(url, [options], callback)
    // - url (string) – connection string url for MongoDB.
    // - [options] (object) – optional options for insert command.
    // - callback (function) – this will be called after executing this connect method:
    // # The first parameter (err) will contain the Error object if an error occured, or null otherwise;
    // # The second parameter (client) will contain the initialized db object or null if an error occured.
);

// CRUD Operation:

// POST(CREATE): an endpoint that will insert a student into a DB.
app.post('/student', (req, res) => {
    
    // Parse the request/parameter and store the data in the variable temperately.
    const student = req.body;

    // Output the student data to the console for debugging.
    console.log(student);

    // Sending request to create a document for the collection called students.
    studentsDB.collection('students').insertOne(req.body, function (err, info) {
        
        // Some more debugging information.
        console.log(err);
        console.log(info);

        res.send('Student is added to the database.');
    });
});

// GET(READ): an endpoint to get all students from the API.
app.get('/students', (req, res) => {

    // Getting all the data from the collection (students) in the DB.
    studentsDB.collection('students').find().toArray(function (err, items) {
        res.json(items);
    });
});

// GET(READ): an endpoint to retrieve specific student by student ID.
// We can define a variable by adding the colon (:).
app.get('/student/:id', (req, res) => {
    
    // Reading id from the URL.
    const id = req.params.id;
    console.log(id);

    // Searching students for the id: use find or findOne
    studentsDB.collection('students').findOne(
        { id: id }, 
        function (err, item) {
            if (err) {
                // Sending 500 code when error occured is a good practice.
                res.status(500).send('Error occured.');
            }

            if (item === null) {
                // Sending 404 code when not found something is a good practice.
                res.status(404).send('Student not found.');
            } 
            else {
                res.json(item);
            }
        }
    );
});

// DELETE: an endpoint to delete a student by id.
app.delete('/student/:id', (req, res) => {
    
    // Reading id from the URL.
    const id = req.params.id;

    // Remove item with that student ID.
    studentsDB.collection('students').deleteOne(
        { id: id },     // MongoDB query: the first id specify that we query by id, the second id specify to delete document by the provide id value. 
        function () {   // Calback function
            res.send('Successfully deleted!')   // Response
        }
    )
});

// PUT(Update): an endpoint to edit a student record by id.
app.put('/student/:id', (req, res) => {
    
    // Reading id from the URL
    const id = req.params.id;

    // Updating a student by its ID and new data
    studentsDB.collection('students').findOneAndUpdate(
        { id: id },
        { $set: req.body }, 
        function () {
            res.send('Student is updated.');
        }
    )
});