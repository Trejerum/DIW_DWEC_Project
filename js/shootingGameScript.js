/**
 * Number of targets
 * @type {Number}
 */
const TARGET_NUMBER = 5;

/**
 * The maximun time for the timer
 * @type {Number}
 */
const MAX_TIME = 60;

/**
 * Timer of the game
 * @type {Number}
 */
var time;

/**
 * The punctuation of the user
 * @type {Number}
 */
var punctuation;

/**
 * Hits made in a row
 * @type {Number}
 */
var hitsInARow;

/**
 * The hits multiplier
 * @type {Number}
 */
var hitsMultiplier = 5;

/**
 * The miss multiplier
 * @type {Number}
 */
var missMultiplier = 5;

/**
 * The hits counter
 * @type {Number}
 */
var hitCount;

/**
 * The miss counter
 * @type {Number}
 */
var missCount;

/**
 * The process that refreshes the timer
 */
var processRefreshTimer;

/**
 * The process that checks the timer
 */
var processCheckTimer;

/**
 * The process that executes the initial countdown
 */
var processCountdown;

/**
 * The process that stops the countdown and starts the game
 */
var processCountdownStop;

/**
 * Method that initializes the application
 */
function init() {
  $(".shootingContainer").css("height", window.innerHeight - 50 + "px");

  // Initiate the countdown to start the game
  var countdownTime = 6;
  $("#countdown").css("display", "block");
  $("#countdown").html(countdownTime);

  processCountdown = setInterval(function() {
    countdownTime--;
    $("#countdown").html(countdownTime);
  }, 1000);

  processCountdownStop = setTimeout(function() {
    clearInterval(processCountdown);
    $("#countdown").css("display", "none");
    startGame();
  }, 5999);
}

/**
 * Funciton that starts the game
 */
function startGame() {

  $(".shootingBackground").on("click", shootingContainerOnClickHandler);

  // Create all the initial targets
  createInitialTargets();
  // Initialize the timer
  time = MAX_TIME;
  initTimer();
  $("#timer").html(time);
  // Initialize the punctuation
  hitCount = 0;
  missCount = 0;
  hitsInARow = 0;
  punctuation = 0;
}

/**
 * Creates the initial targets based on the value of TARGET_NUMBER
 */
function createInitialTargets() {
  for (var i = 0; i < TARGET_NUMBER; i++) {
    createTarget(i);
  }
}

/**
 * Creates a new target
 * @param  {[Number]} idNumber The number for the id
 */
function createTarget(idNumber) {
  // Create the img, the id and calculate the position
  var img = document.createElement("img");
  var id = "target_" + idNumber;
  var position = calculatePosition();
  // Set all the attributes of the target
  img.src = "../assets/shooting_target_image.png";
  img.draggable = false;
  img.setAttribute("id", id);
  img.className = "target";
  // Set the position of the target
  img.style.left = position[0];
  img.style.top = position[1];
  // Add the target
  $(".shootingContainer").append(img);
  // Set the click event
  $("#" + id).on("click", {id: id}, targetOnClickHandler);
}

/**
 * Calculates the position for a target in px
 * @return {[Array]} An array with the positions (X, Y) in px
 */
function calculatePosition() {
  // 100 is the width of the box and 30 is just to apply a margin
  var screenWidth = window.innerWidth - 100 - 30;
  // 70 is the height of the box and 30 is just to apply a margin
  var screenHeight = window.innerHeight - 70 - 30;
  var coordX = Math.floor((Math.random() * (screenWidth - 100)) + 100) + "px";
  // We add another 80 because of the header(50 + 30(margin))
  var coordY = Math.floor((Math.random() * (screenHeight - 150)) + 150) + "px";
  var position = new Array(coordX, coordY);
  return position;
}

/**
 * Handles the action of clicking a certain target
 * @param  {[Event]} event the event
 */
function targetOnClickHandler(event) {
  var position = calculatePosition();
  document.getElementById(event.data.id).style.left = position[0];
  document.getElementById(event.data.id).style.top = position[1];
  punctuation += calculatePunctuation(true);
  hitCount++;
  $("#punctuation").html(punctuation);
}

/**
 * Handles the action of clicking in the background, this means that the user
 * has missed the shot
 */
function shootingContainerOnClickHandler() {
  punctuation -= calculatePunctuation(false);
  missCount++;
  $("#punctuation").html(punctuation);
}

/**
 * Method that calculates how many points are made in each shot
 * @param  {[Boolean]} itsAHit True if its a hit, False if its a miss
 * @return {[Integer]} The points calculated
 */
function calculatePunctuation(itsAHit) {
  var ret = 0;
  if(itsAHit) {
    if(hitsInARow < 0) {
      hitsInARow = 0;
    }
    hitsInARow++;
    if(missMultiplier > 5) {
      missMultiplier = 5;
    }
    hitsMultiplier+= 0.3;
    ret = 75 + hitsInARow * hitsMultiplier;
  } else {
    if(hitsInARow > 0) {
      hitsInARow = 0;
    }
    hitsInARow--;
    if(hitsMultiplier > 5) {
      hitsMultiplier = 5;
    }
    missMultiplier++;
    ret = 50 + Math.abs(hitsInARow) * missMultiplier;
  }
  ret = Math.floor(ret);
  return ret;
}

/**
 * Initializes the timer
 */
function initTimer() {
  processRefreshTimer = setInterval(refreshTimer, 1000);
  processCheckTimer = setInterval(checkTimer, 1000);
}

/**
 * Changes the value of the timer
 */
function refreshTimer() {
  time--;
  document.getElementById("timer").innerHTML = time;
}

/**
 * Checks if the timer has reached 0, in this case it stops the timer
 */
function checkTimer() {
  if(time == 0) {
    finishGame();
  }
}

// Finishes the game
function finishGame() {
  clearAllProcesses();
  $(".target").remove();
  var totalShots = missCount + hitCount;
  var averageTimePerShot = 0;
  if(totalShots > 0) {
    averageTimePerShot = Math.floor(MAX_TIME / totalShots * 1000) + "ms";
  }
  displayResults();
}

/**
 * Displays the results of the game
 */
function displayResults() {

  var shootingResultsContainer;
  var shootingResults;
  var shootingCurrentResults;
  var shootingBestResults;
  var shootingResultsButtons;
  var button;
  var text;

  // Create the container for the results div
  shootingResultsContainer = document.createElement("div");
  shootingResultsContainer.className = "shootingResultsContainer";

  // Create the results div
  shootingResults = document.createElement("div");
  shootingResults.className = "shootingResults";

  // Create the current results div
  shootingCurrentResults = document.createElement("div");
  shootingCurrentResults.className = "shootingCurrentResults";
  shootingCurrentResults = addCurrentResults(shootingCurrentResults);

  // Create the best results div
  shootingBestResults = document.createElement("div");
  shootingBestResults.className = "shootingBestResults";
  shootingBestResults = addBestResults(shootingBestResults);

  // Create the results buttons div
  shootingResultsButtons = document.createElement("div");
  shootingResultsButtons.className = "shootingResultsButtons";

  button = document.createElement("button");
  button.className = "shootingRestartButton";
  text = document.createTextNode("Restart");
  button.append(text);
  shootingResultsButtons.append(button);

  button = document.createElement("button");
  button.className = "shootingExitButton";
  text = document.createTextNode("Exit");
  button.append(text);
  shootingResultsButtons.append(button);

  // Append all to the main page
  shootingResults.append(shootingCurrentResults);
  shootingResults.append(shootingBestResults);
  shootingResults.append(shootingResultsButtons);
  shootingResultsContainer.append(shootingResults);
  $(".shootingGame").append(shootingResultsContainer);

  // Add event handlers to created buttons
  $(".shootingRestartButton").on("click", restart);
  $(".shootingExitButton").on("click", exit);
}

/**
 * Adds the current results to its container
 * @param {[type]} shootingCurrentResults the container where the current
 * results are going to be displayed
 * @return shootingCurrentResults
 */
function addCurrentResults(shootingCurrentResults) {

  var h2;
  var p;
  var text;
  var totalShots = 0;
  var averageTimePerShot = 0;
  var precision = 0;

  // Create the heading title for the results
  h2 = document.createElement("h2");
  text = document.createTextNode("Your Results");
  h2.append(text);
  shootingCurrentResults.append(h2);

  // Add the score to results
  p = document.createElement("p");
  text = document.createTextNode("Score: " + punctuation);
  p.append(text);
  shootingCurrentResults.append(p);

  // Add the total shots to results
  totalShots = hitCount + missCount;
  p = document.createElement("p");
  text = document.createTextNode("Total shots: " + totalShots);
  p.append(text);
  shootingCurrentResults.append(p);

  // Add the successful shots to results
  p = document.createElement("p");
  text = document.createTextNode("Successful shots: " + hitCount);
  p.append(text);
  shootingCurrentResults.append(p);

  // Add the missed shots to results
  p = document.createElement("p");
  text = document.createTextNode("Missed shots: " + missCount);
  p.append(text);
  shootingCurrentResults.append(p);

  // Add the precision to results
  if(totalShots > 0) {
    precision = Math.floor(hitCount / totalShots * 100);
  }
  precision += "%";
  p = document.createElement("p");
  text = document.createTextNode("Precision: " + precision);
  p.append(text);
  shootingCurrentResults.append(p);

  // Add the average time per shot to results
  if(totalShots > 0) {
    averageTimePerShot = Math.floor(MAX_TIME / totalShots * 1000) + "ms";
  }
  p = document.createElement("p");
  text = document.createTextNode("Average Time per shot: " + averageTimePerShot);
  p.append(text);
  shootingCurrentResults.append(p);

  return shootingCurrentResults;
}

/**
 * Add the best scores to its container
 * @param shootingBestResults The container where the best scores are going to
 * be displayed
 * @return shootingBestResults
 */
function addBestResults(shootingBestResults) {

  var bestScores = localStorage.getItem("bestScores");
  var scoreChangedPosition;
  var h2;
  var ol;
  var li;
  var text;
  var aux;


  if(bestScores) {
    bestScores = bestScores.split(",");
    // Compare your punctuation to the best scores
    for (var i = bestScores.length - 1; i >= 0; i--) {
      if(bestScores[i] < punctuation) {
        if(i != bestScores.length - 1) {
          bestScores[i + 1] = bestScores[i];
          bestScores[i] = punctuation;
        } else {
          bestScores[i] = punctuation;
        }
        scoreChangedPosition = i;
      }
    }
    // Update the localStorage with the new scores
    localStorage.setItem("bestScores", bestScores.toString());
  } else {
    // Create the best scores
    bestScores = new Array();
    bestScores.push(punctuation);
    for (var i = 1; i < 10; i++) {
      bestScores[i] = 0;
    }
    localStorage.setItem("bestScores", bestScores.toString());
  }

  ol = document.createElement("ol");
  for (var i = 0; i < bestScores.length; i++) {
    li = document.createElement("li");
    aux = bestScores[i].toString();
    aux += " ";
    for (var j = aux.length; j < 12; j++) {
      aux += "_";
    }
    aux = "___ " + aux;
    if(scoreChangedPosition == i) {
      text = document.createTextNode(aux += "*New");
    } else {
      text = document.createTextNode(aux);
    }

    li.append(text);
    ol.append(li);
  }

  // Create the heading title for the results
  h2 = document.createElement("h2");
  text = document.createTextNode("Best Scores");
  h2.append(text);

  shootingBestResults.append(h2);
  shootingBestResults.append(ol);

  return shootingBestResults;
}

/**
 * Restarts the game
 */
function restart() {
  $(".shootingResultsContainer").remove();
  init();
}

/**
 * Exits the application
 */
function exit() {
  location.href = "../index.html";
}

/**
 * Clears all the processes initialized during the execution of the application
 */
function clearAllProcesses() {
  clearInterval(processRefreshTimer);
  clearInterval(processCheckTimer);
}
