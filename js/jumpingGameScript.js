
/**
 * The process of moving the scenary
 * @type {Boolean}
 */
var moveScenaryProcess;

/**
 * The process that changes the velocity during the execution of the game
 * @type {Boolean}
 */
var changeVelocityProcess;

/**
 * The process that updates the punctuation
 * @type {Boolean}
 */
var changePunctuationProcess;

/**
 * The process that changes the initial counter
 * @type {Boolean}
 */
var changeCounterProcess;

/**
 * Checks if the game is running or not
 * @type {Boolean}
 */
var isGameRunning = false;

/**
 * The obstacles created in the scenary
 * @type {Array}
 */
var obstacles = new Array();

/**
 * The punctuation of the game
 * @type {Number}
 */
var punctuation = 0;

/**
 * The velocity of the obstacles
 * @type {Number}
 */
var obstacleVelocity = 0;

/**
 * The maximun time between the creation of obstacles
 * @type {Number}
 */
var timeMaxRange = 0;

// Method that initializes the application
function init() {
  $(".jumpingGame").css({"height":window.innerHeight, "width":window.innerWidth});
  setTimeout(start, 6000);
  initCounter();
}

/**
 * Initializes the counter displayed when the window is opened for the
 * first time
 */
function initCounter() {
  var counter = 6;
  changeCounterProcess = setInterval(function() {
    counter--;
    $("#jumpingGameInitCounter").html(counter);
    if(counter == 0) {
      $(".jumpingGameInitCounterContainer").css("display", "none");
      clearInterval(changeCounterProcess);
    }
  }, 1000);
}

/**
 * Starts the game. Sets the events and initializes the global varibles needed
 */
function start() {
  $(document).on({
    keydown: function(event) {
      if(event.which == 32 || event.which == 87 || event.which == 38 || event.which == 13) {
        jump();
      } else if(event.which == 67 || event.which == 17 || event.which == 40 || event.which == 83){
        $(".box").css("height", "30px");
      } else {
        alert(event.which);
      }
    },
    keyup: function(event) {
      if(event.which == 67 || event.which == 17 || event.which == 40 || event.which == 83) {
        $(".box").css("height", "50px");
      }
    }
  });

  obstacleVelocity = 1;
  isGameRunning = true;
  timeMaxRange = 2000;

  initPunctuation();
  createObstaclesRandomly();
  moveScenaryProcess = setInterval(moveScenary, 1);
  changeVelocity();
}

function createObstaclesRandomly() {
  if(isGameRunning) {
    createObstacle();
    var rand = Math.floor((Math.random() * (timeMaxRange - 800)) + 800);
    console.log(rand);
    setTimeout(createObstaclesRandomly, rand);
  }
}

/**
 * Creates a new obstacle in the scenary.
 * There're 2 types of obstacles, floating obstacles and non floating obstacles.
 */
function createObstacle() {
  var obstacle = document.createElement("div");
  // Random number: 1 = non floating obstacle, 0 = floating obstacle
  var typeOfObstacle = Math.floor((Math.random() * (2 - 0)) + 0);
  switch (typeOfObstacle) {
    case 1:
      obstacle.style.bottom = "0px";
      break;
    case 0:
      obstacle.style.bottom = "40px";
      break;
  }

  obstacle.style.left="1150px";
  obstacle.setAttribute('class', 'obstacle');
  document.getElementsByClassName("sky")[0].appendChild(obstacle);
}

/**
 * Moves the scenary with all the obstacles.
 * This method also controls the collisions.
 */
function moveScenary() {
  // Load all the obstacles
  obstacles = document.getElementsByClassName("obstacle");
  // Loop throw all the obstacles to change their positions
  for (var i = 0; i < obstacles.length; i++) {
    var position = obstacles[i].style.left;
    position = position.split("px")[0];
    // Check if the obstacle has reached the end of the map. If yes the
    // obstacle its removed, else it continues moving
    if(position < 0) {
      obstacles[i].remove();
    } else {
      //Change the horizontal position of the obstacle
      position -= obstacleVelocity;
      var positionStr = position + "px";
      obstacles[i].style.left = positionStr;

      // Check if the horizontal position of the obstacle is the same as the
      // horizontal position of the box
      if(position > 220 && position < 300) {
        var positionBoxStr = $(".box").css("bottom");
        var positionBoxNum = positionBoxStr.split("px")[0];

        // Check if its a non floating obstacle or a floating obstacle
        if(obstacles[i].style.bottom == "0px") {
          if(positionBoxNum < 30) {
            gameOver();
          }
        } else {
          var boxHeightStr = $(".box").css("height");
          var boxHeightNum = boxHeightStr.split("px")[0];
          if(boxHeightNum > 30) {
            if(positionBoxNum > 40 && positionBoxNum < 70 || positionBoxNum < 40) {
              gameOver();
            }
          } else {
            if(positionBoxNum > 10 && positionBoxNum < 70) {
              gameOver();
            }
          }
        }
      }
    }
  }
}

/**
 * Initializes de puntuation
 */
function initPunctuation() {
  punctuation = 0;
  changePunctuationProcess = setInterval(changePunctuation, 100);
}

/**
 * Changes the value of the punctuation
 */
function changePunctuation() {
  punctuation += 1;
  if(punctuation % 500 == 0) {
    punctuation += 100;
    $("#extraPoints").css("display", "inline-block");
    $("#extraPoints").addClass('disappear');
    setTimeout(function() {
      $("#extraPoints").css("display", "none");
    }, 1500);
  }
  $("#punctuation").html("Score: " + punctuation);
}

/**
 * This method controls the logic executed when the game is finished because
 * the user has lost
 */
function gameOver() {
  clearAllProcesses();
  isGameRunning = false;
  $(".gameOver").css("display", "block");
  $(document).off("keydown");
  $(document).off("keyup");
  // Reset the height of the box in case it has changed
  $(".box").css("height", "50px");
  $(".obstacle").remove();
}

/**
 * Restarts the game
 * @return {[type]} [description]
 */
function restart() {
  $(".gameOver").css("display", "none");
  start();
}

/**
 * Changes the velocity of the obstacles
 */
function changeVelocity() {
  changeVelocityProcess = setInterval(function() {
    obstacleVelocity += 0.1;
    if(obstacleVelocity > 3) {
      timeMaxRange -= 200;
    }
    if(obstacleVelocity > 4) {
      timeMaxRange -= 200;
    }
  }, 7000);
}

/**
 * Finishes all the processes initialized during execution of the game
 */
function clearAllProcesses() {
  clearInterval(moveScenaryProcess);
  clearInterval(changeVelocityProcess);
  clearInterval(changePunctuationProcess);
}

/**
 * Handles jumping action of the box
 */
function jump() {
  if($(".box").css("top") == "250px") {
    $(".box").addClass('jump');
    setTimeout(function() {
      $(".box").removeClass('jump');
    }, 800);
  }
}
