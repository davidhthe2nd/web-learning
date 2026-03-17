import inquirer from "inquirer";
import qr from "qr-image";
import fs from "fs";

inquirer
  .prompt([
    { type: "input", name: "url", message: "Enter a URL to generate a QR code: " }
  ])
  .then((answers) => {
    var url = answers.url;
    qr.image(url, { type: 'svg' }).pipe(fs.createWriteStream('qr_code.svg'));
    fs.writeFile("url.txt", url, (err) => {
      if (err) throw err;
      console.log("The file has been saved!");
    });
  })
  .catch((error) => {
    if (error.isTtyError) {
      console.log("Prompt couldn't be rendered in the current environment");
    } else {
      console.log("Something went wrong, please try again");
    }
  });

//2. Use the qr-image npm package to turn the user entered URL into a QR code image.



//3. Create a txt file to save the user input using the native fs node module.

