
// Enumerators

/**
 * Enumerator that represents the different directions
 * @type {Enum}
 */
const Direction = {
  UP: 1,
  DOWN: 2,
  LEFT: 3,
  RIGHT: 4
};
Object.freeze(Direction);

// Constants

/**
 * Constant tfor the movement speed. It must be the same as the size of a
 * snakes parts
 * @type {Number}
 */
const MOVEMENT_SPEED = 20;

// Global variables

/**
 * The context of the canvas
 */
var ctx;

/**
 * The canvas where the game is created
 */
var canvas;

/**
 * The current direction of the snake
 */
var snakeDirection;

/**
 * The position of the food
 */
var foodPosition;

/**
 * The punctuation made by the user
 * @type {[type]}
 */
var punctuation;

/**
 * The process that makes the snake move
 */
var processSnakeMovement;

/**
 * Process for the countdown
 */
var processCountdown;

/**
 * The steps made by the snake
 */
var steps;

/**
 * Countdown
 */
var countdown = 0;

/**
 * Controls that only one key is pressed each step
 * @type {Boolean}
 */
var keyPressed = false;

/**
 * Stores the position of each body part of the snake. It contains two
 * coordinates: x & y
 * @type {Array}
 */
var snake = new Array(
                          {coordX:320, coordY:300},
                          {coordX:300, coordY:300},
                          {coordX:280, coordY:300}
                        );

// Initialize the application
$(document).ready(function() {
  $("#snakeRestart").on("click", restart);
  $("#snakeExit").on("click", exit);
  init();
});

/**
 * Initializes the game
 */
function init() {
  // Set the height of the application
  $(".snakeGame").css("height", window.innerHeight + "px");
  $(".snakeGameOver").hide();
  $("#snakeCanvas").show();

  // Init punctuation
  punctuation = 0;
  $("#snakePunctuation").html(punctuation);
  // Init the countdown
  initCountdown();

}

/**
 * Starts the game
 */
function start() {
  // Set the keydown event handlers
  $(document).on("keydown", function() {
    if(!keyPressed) {
      if(event.which == 38 || event.which == 87) {
        // Up
        if(snakeDirection != Direction.DOWN) {
          snakeDirection = Direction.UP;
        }
      } else if(event.which == 40 || event.which == 83) {
        // Down
        if(snakeDirection != Direction.UP) {
          snakeDirection = Direction.DOWN;
        }
      } else if(event.which == 39 || event.which == 68) {
        // Right
        if(snakeDirection != Direction.LEFT) {
          snakeDirection = Direction.RIGHT;
        }
      } else if(event.which == 37 || event.which == 65) {
        // Left
        if(snakeDirection != Direction.RIGHT) {
          snakeDirection = Direction.LEFT;
        }
      }
      keyPressed = true;
      setTimeout(function() {
        keyPressed = false;
      }, 90);
    }
  });

  foodPosition = null;
  steps = 0;
  loadCanvas("snakeCanvas");
  snakeDirection = Direction.RIGHT;
  processSnakeMovement = setInterval(moveSnake, 100);
  changeFoodPosition();
  drawFood();
}

/**
 * Initializes the countdown before the game starts
 */
function initCountdown() {
  countdown = 6;
  $("#snakeCountdown").html(countdown);
  $("#snakeCountdown").show();
  processCountdown = setInterval(function() {
    countdown--;
    $("#snakeCountdown").html(countdown);
    if(countdown == 0) {
      clearInterval(processCountdown);
      $("#snakeCountdown").hide();
      start();
    }
  }, 1000);
}

/**
 * Draws the snake
 */
function drawSnake() {
  if(ctx != null) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "White";
    ctx.beginPath();
    for (var i = 0; i < snake.length; i++) {
      ctx.fillRect(snake[i].coordX, snake[i].coordY, 20, 20);
    }
    ctx.closePath();
  }
}

/**
 * Changes the position of the snake
 */
function moveSnake() {

  var coordXMovement = 0;
  var coordYMovement = 0;
  var newSnakeCoordX;
  var newSnakeCoordY;

  switch (snakeDirection) {
    case Direction.UP:
      coordYMovement -= MOVEMENT_SPEED;
      break;
    case Direction.DOWN:
      coordYMovement += MOVEMENT_SPEED;
      break;
    case Direction.RIGHT:
      coordXMovement += MOVEMENT_SPEED;
      break;
    case Direction.LEFT:
      coordXMovement -= MOVEMENT_SPEED;
      break;
  }
  newSnakeCoordX = snake[0].coordX + coordXMovement;
  newSnakeCoordY = snake[0].coordY + coordYMovement;

  if(newSnakeCoordX < 0) {
    newSnakeCoordX = 600;
  } else if(newSnakeCoordX > 580) {
    newSnakeCoordX = 0;
  }

  if(newSnakeCoordY < 0) {
    newSnakeCoordY = 600;
  } else if(newSnakeCoordY > 580) {
    newSnakeCoordY = 0;
  }

  snake.unshift({
    coordX: newSnakeCoordX,
    coordY: newSnakeCoordY
  });
  snake.pop();
  drawSnake();
  checkSnake();
  drawFood();
  checkFood();
  steps++;
}

/**
 * Checks if the snake has bitten herself
 */
function checkSnake() {
  for (var i = 1; i < snake.length; i++) {
    if(snake[0].coordX == snake[i].coordX &&
       snake[0].coordY == snake[i].coordY) {
       gameOver();
    }
  }
}

/**
 * Grows the snake
 */
function growSnake() {
  snake.push({
    coordX: snake[snake.length - 1].coordX,
    coordY: snake[snake.length - 1].coordY
  });
}

/**
 * Draws the food
 */
function drawFood() {

  ctx.beginPath();
  ctx.fillStyle = "Green";
  ctx.fillRect(foodPosition.coordX, foodPosition.coordY, 20, 20);
  ctx.closePath();

}

/**
 * Checks if the snake has bitten the food
 */
function checkFood() {
  if(snake[0].coordX == foodPosition.coordX &&
    snake[0].coordY == foodPosition.coordY) {
      growSnake();
      changeFoodPosition();
      changePunctuation();
  }
}

/**
 * Changes the location of the food
 * @return {[type]} [description]
 */
function changeFoodPosition() {
  var coordX = 0;
  var coordY = 0;
  var isValid;

  do {
    isValid = true;
    coordX = Math.floor((Math.random() * (600 - 100)) + 100);
    coordY = Math.floor((Math.random() * (600 - 100)) + 100);
    for (var i = 0; i < snake.length; i++) {
      if(snake[i].coordX == coordX && snake[i].coordY == coordY) {
        isValid = false;
      }
      if(coordX % 20 != 0 || coordY % 20 != 0) {
        isValid = false;
      }
    }
  }while(!isValid);

  if(foodPosition) {
    foodPosition.coordX = coordX;
    foodPosition.coordY = coordY;
  } else {
    foodPosition = {coordX: coordX, coordY:coordY};
  }
}

/**
 * Changes the value of the puntuation made by the user
 */
function changePunctuation() {
  punctuation += 10;
  $("#snakePunctuation").html(punctuation);
}

/**
 * Game over. Finishes the game
 */
function gameOver() {
  clearInterval(processSnakeMovement);
  $(".snakeGameOver").show();
  $("#snakeCanvas").hide();
  $(document).off("keydown");
}

/**
 * Restarts the game. Resets the snake and call the init method
 */
function restart() {
  snake = new Array(
            {coordX:320, coordY:300},
            {coordX:300, coordY:300},
            {coordX:280, coordY:300}
          );
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  init();
}

/**
 * Sets the canvas
 */
function loadCanvas(canvasId) {
  canvas = document.getElementById(canvasId);
  if (canvas.getContext) {
    ctx = canvas.getContext("2d");
  } else {
    ctx = null;
  }
}

/**
 * Exits the application
 * @return {[type]} [description]
 */
function exit() {
  location.href = "../index.html";
}
