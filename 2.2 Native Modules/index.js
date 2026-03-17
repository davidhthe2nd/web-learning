const fs = require("fs");

//fs.writeFile("message_david.txt", "Hello from NodeJS", (err) => {
    //if (err) throw err;
    //console.log("File created successfully")
//});

fs.readFile("message_david.txt", "utf-8", (err, data) => {
    if (err) throw err;
    console.log("File content: ", data);
});