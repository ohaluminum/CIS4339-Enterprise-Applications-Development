const express = require('express')
const cors = require('cors');

const app = express();

// Cross-origin resource sharing (CORS): 
// - a mechanism that allows restricted resources on a web page to be requested,
// - from another domain outside the domain from which the first resource was served.

// Using this CORS middleware to our express app.
app.use(cors());

// Configuring express middleware:
// - Helps us decode the body from an HTTP request (this is called body-parser).
// - What the body-parser middleware will be doing is grabbing the HTTP body, decoding the information,
// - and appending it to the req.body. 
// - From there, we can easily retrieve the information from a request.
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// The place where we will keep students for now.
let students = [];

const PORT = 3000;

app.listen(PORT, () => {

    // If you want to put a variables insde javascript strings, remember to use backtick (`), but not a quote(' or ").
    console.log(`Hello world app listening on port ${PORT}!`);
});

// CRUD Operation:

// POST(CREATE): an endpoint that will take some json formatted data and create an element in stutdents array.
app.post('/student', (req, res) => {

    // Parse the request/parameter and store the data in the variable temperately.
    const student = req.body;

    // Output the student data to the console for debugging.
    console.log(student);
    students.push(student);

    res.send('Student is added to the database.');
});

// GET(READ): an endpoint to get all students from the API.
app.get('/students', (req, res) => {

    // Check formated results at: https://jsonformatter.org/
    res.json(students);
});

// PUT(UPDATE): an endpoint to edit a student record by id.
app.put('/student/:id', (req, res) => {

    // Reading id from the URL.
    const id = req.params.id;
    const newStudent = req.body;

    // Update item from the students array.
    for (let i = 0; i < students.length; i++) {
        
        let student = students[i]
        if (student.id === id) {
            students[i] = newStudent;
        }
   }

   res.send('Student is updated.');
});

// DELETE: an endpoint to delete a student by id.
app.delete('/student/:id', (req, res) => {
    
    // Reading id from the URL.
    const id = req.params.id;

    // Remove item from the students array: 
    // - Method filter() creates a new array with all elements that pass the test implemented by the provided function.
    students = students.filter(i => {
        
        if (i.id !== id) {
            return true;    // Show in the new array.
        }
        return false;       // Not show in the new array.
    });

    res.send('Student is deleted.');
});