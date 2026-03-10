buttonColours = ["red", "blue", "green", "yellow"];
var randomChosenColour;
gamePattern = [];

function nextSequence(){
    var randomNumber = Math.floor(Math.random() * 4);
    console.log(randomNumber);
    randomChosenColour = buttonColours[randomNumber];
    gamePattern.push(randomChosenColour);
}

nextSequence();