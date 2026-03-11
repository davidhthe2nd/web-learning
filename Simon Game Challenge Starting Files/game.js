buttonColours = ["red", "blue", "green", "yellow"];
var randomChosenColour;
// button patterns by the game and the user, to compare each level
gamePattern = [];
userClickedPattern = [];
// to check if the game has started or not
var gameStarted = false;

//checks if the game has started; if it's the case, it calls the nextSequence function and changes the title to level 0
$(document).keydown(function(){
    if (!gameStarted) {
        $("#level-title").text("Level " + gamePattern.length);
        nextSequence();
        gameStarted = true;
    }
});

//jquery to check if a button is clicked, then it gets the id of the button, adds it to the user pattern, and plays its sound and animation
$(".btn").click(function(){
    var userChosenColour = $(this).attr("id");
    userClickedPattern.push(userChosenColour);
    playSound(userChosenColour);
    animatePress(userChosenColour);
    checkAnswer(userClickedPattern.length - 1);
});

function checkAnswer(currentLevel) {
    if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
      if (userClickedPattern.length === gamePattern.length){
        setTimeout(function () {
          nextSequence();
        }, 1000);
      }
    } else {
      playSound("wrong");
      $("body").addClass("game-over");
      $("#level-title").text("Game Over, Press Any Key to Restart");

      setTimeout(function () {
        $("body").removeClass("game-over");
      }, 200);

      startOver();
    }
}


// updates the level number based on the gamePattern array length, generates a random number between 1 and 4,
// then based on that number it chooses a color button, it adds it to the gamePattern array, animates the button and plays its sound
function nextSequence(){
    userClickedPattern = [];
    $("#level-title").text("Level " + (gamePattern.length+1));
    var randomNumber = Math.floor(Math.random() * 4);
    randomChosenColour = buttonColours[randomNumber];
    gamePattern.push(randomChosenColour);
    $("#" + randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);
    playSound(randomChosenColour);
}

//adds the animation effect when the player clicks a button
function animatePress(currentColour){
    $("#" + currentColour).addClass("pressed");
    setTimeout(function(){
        $("#" + currentColour).removeClass("pressed");
    }, 100);
}

// consolidated function to play sounds, used in nextSequence or when the user clicks a button
function playSound(name){
    var audio = new Audio("sounds/" + name + ".mp3");
    audio.play();
}




function startOver(){
        gamePattern = [];
        userClickedPattern = [];
        gameStarted = false;
}
