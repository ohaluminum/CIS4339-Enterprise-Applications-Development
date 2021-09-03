
// Without required packages
const fs = require("fs")    // File system

fs.readFile("test.docx", "utf-8", (err, data) => {
    if (err) {
        console.log(err);
    }

    console.log("Data has been read from file: \t", data);
})

// With required packages
const WordExtractor = require("word-extractor")

const extractor = new WordExtractor();
const extracted = extractor.extract("test.docx");

// From the Mozilla documentation: "The then() method returns a Promise. 
// It takes two arguments: callback functions for the success and failure cases of the Promise.""
extracted.then(function(doc) { console.log(doc.getBody()); });

// Import Funnies from funnies: A flexible way to add funny loading messages to webapps with optional react support.
let funnies = require('funnies')
let joke = new funnies.Funnies();

for (i = 0; i < 5; i++) {
    console.log(joke.message());
}
