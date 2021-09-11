// Part 1: super basic express app
var express = require('express');       // require(): to load modules/libraries
var app = express();

// The default route will simply send some text back
app.get('/', (req, res) => {
    res.send('Hello world, from CIS4339!');
});

// Part 2: add simple get route
// - Triggers the callback for the route /simple which simply returns a json formatted output
// - Two parameters: req (request body) and res (response body) 
app.get('/simple', (req, res) => {
    res.json(['Tony', 'Lisa', 'Michael', 'Ginger', 'Food']);
})

// The default post for express is 3000
app.listen(3000, () => {
    console.log('Backend server listening on port 3000!');
});

// How to install the express package?
// - npm install express --save
// - --save: package will appear inside the dependencies in the packages.json file.

// npm install: look for package.js and read it then simply install all the dependencies.