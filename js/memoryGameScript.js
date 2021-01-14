// Enumerators

/**
 * Enumerator that represents the level of difficulty of the game
 * @type {Enum}
 */
const Difficulty = {
  EASY: 1,
  NORMAL: 2,
  HARD: 3
};
Object.freeze(Difficulty);

// Constants

/**
 * The number of errors that the user can make
 * @type {Number}
 */
const MAX_ERRORS = 3;

// Global variables

/**
 * The game's difficulty selected by the user
 * @type {Difficulty}
 */
var gameDifficulty = Difficulty.HARD;

/**
 * The level of the game
 * @type {Number}
 */
var level;

/**
 * [selectedObjectives description]
 * @type {Number}
 */
var punctuation;

/**
 * The number of errors commited by the user
 * @type {Number}
 */
var errors;

/**
 * Objectives selected by the user as an answer
 * @type {Array}
 */
var selectedObjectives = new Array();

/**
 * Objectives selected by the game
 * @type {Array}
 */
var solutionObjectives = new Array();

/**
 * All the objectives of the game
 * @type {Array}
 */
var objectives;

/**
 * Manages the created Objectives
 * Its used to remove them all at the end of the game
 * @type {Array}
 */
var allObjectives = new Array();


// Methods

/**
 * Starts the game
 * @return {[type]} [description]
 */
function start() {
  document.getElementsByClassName("rememberMenu")[0].style.display = "none";
  level = 1;
  punctuation = 0;
  errors = 0;
  markedObjectivesNumber = 3;
  document.getElementById("punctuation").innerHTML = "Score: " + punctuation;
  document.getElementById("level").innerHTML = "Level: " + level;
  document.getElementById("errors").innerHTML = "Errors: " + errors;
  punctuation = 0;
  setUpDifficulty();
  startLevel();
}

/**
 * Starts a level of the game
 */
function startLevel() {
  let activeObjective;
  let counter = 0;
  let isRepeated = false;

  let processStartLevel = setInterval(function() {
    do {
      isRepeated = false;
      activeObjective = Math.floor((Math.random() * (objectives.length - 0)) + 0);
      for (var i = 0; i < solutionObjectives.length; i++) {
        if(solutionObjectives[i] == objectives[activeObjective].id) {
          isRepeated = true;
        }
      }
    } while(isRepeated);
    solutionObjectives.push(objectives[activeObjective].id);
    objectives[activeObjective].style.background = "#0066ff";
    setTimeout(function() {
      objectives[activeObjective].style.background = "grey";
    }, 1000);
    counter++;
    if(counter == markedObjectivesNumber) {
      for (var i = 0; i < objectives.length; i++) {
        let a = i;
        objectives[i].addEventListener("click", checkObjective);
      }
      clearInterval(processStartLevel);
    }
  }, 1500);
}

/**
 * Checks if the objectives selected by the user are the correct ones
 */
function checkObjective() {
  let isCorrect = true;
  this.style.background = "#33cc33";
  this.removeEventListener("click", checkObjective);
  selectedObjectives.push(this.id);
  for (var i = 0; i < selectedObjectives.length; i++) {
    if(selectedObjectives[i] != solutionObjectives[i]) {
      this.style.background = "#ff0033";
      isCorrect = false;
      errors++;
      endLevel();
    }
  }
  if(selectedObjectives.length == markedObjectivesNumber && isCorrect) {
    punctuation++;
    endLevel();
  }
}

/**
 * Ends the current level
 */
function endLevel() {
  level++;
  document.getElementById("punctuation").innerHTML = "Score: " + punctuation;
  document.getElementById("level").innerHTML = "Level: " + level;
  document.getElementById("errors").innerHTML = "Errors: " + errors;
  for (var i = 0; i < objectives.length; i++) {
    objectives[i].removeEventListener("click", checkObjective);
  }
  setTimeout(function() {
    selectedObjectives = new Array();
    solutionObjectives = new Array();
    for (var i = 0; i < objectives.length; i++) {
      objectives[i].style.background = "grey";
    }
    if(level % 3 == 0 && markedObjectivesNumber < objectives.length && markedObjectivesNumber < objectives.length) {
      markedObjectivesNumber++;
    }
    if(errors < MAX_ERRORS) {
      startLevel();
    } else {
      endGame();
    }

  }, 1500);
}

/**
 * Ends the current game
 */
function endGame() {
  console.log("End of the game");
  document.getElementsByClassName("rememberMenu")[0].style.display = "inline-block";
  deleteAllObjectives();
}

/**
 * Sets the difficulty of the game depending on what option is selected by the
 * user
 */
function setUpDifficulty() {
  let options = document.getElementsByName("rememberDifficulty");
  let selectedOption = "normal";
  for (var i = 0; i < options.length; i++) {
    if(options[i].checked) {
      selectedOption = options[i].value;
    }
  }
  switch (selectedOption) {
    case "easy":
      gameDifficulty = Difficulty.EASY;
      break;
    case "normal":
      gameDifficulty = Difficulty.NORMAL;
      break;
    case "hard":
      gameDifficulty = Difficulty.HARD;
      break;
    default:
      gameDifficulty = Difficulty.NORMAL;

  }
  switch (gameDifficulty) {
    case Difficulty.EASY:
      easyMode();
      break;
    case Difficulty.NORMAL:
      normalMode();
      break;
    case Difficulty.HARD:
      hardMode();
      break;
  }
}

/**
 * Sets up the game for easy mode
 */
function easyMode() {
  createObjectives(12);
  objectives = document.getElementsByClassName('objective');
  for (var i = 0; i < objectives.length; i++) {
    objectives[i].style.width = "300px";
    objectives[i].style.height = "200px";
  }
}

/**
 * Sets up the game for normla mode
 */
function normalMode() {
  createObjectives(20);
  objectives = document.getElementsByClassName('objective');
  for (var i = 0; i < objectives.length; i++) {
    objectives[i].style.width = "240px";
    objectives[i].style.height = "150px";
  }
}

/**
 * Sets up the game for hard mode
 */
function hardMode() {
  createObjectives(36);
  objectives = document.getElementsByClassName('objective');
  for (var i = 0; i < objectives.length; i++) {
    objectives[i].style.width = "200px";
    objectives[i].style.height = "100px";
  }
}

/**
 * Creates all the objectives of the game
 * @param  {[type]} objectiveNumber The number of objectives needed
 */
function createObjectives(objectiveNumber) {
  for (var i = 0; i < objectiveNumber; i++) {
    createObjective(i);
  }
}

/**
 * Creates a new objective
 * @param  {[type]} idNumber the id for the new objective
 */
function createObjective(idNumber) {
  let div = document.createElement("div");
  let id = "obj_" + idNumber;
  div.className = "objective";
  div.setAttribute("id", id);
  document.getElementsByClassName("rememberContainer")[0].append(div);
  allObjectives.push(div);
}

/**
 * Deletes all the objectives
 */
function deleteAllObjectives() {
  for (var i = 0; i < allObjectives.length; i++) {
    allObjectives[i].remove();
  }
  allObjectives = new Array();
}

/**
 * Exits the application
 */
function exit() {
  location.href = "../index.html";
}
