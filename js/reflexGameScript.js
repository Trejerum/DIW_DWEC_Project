/**
 * The color that displays when the button should be clicked
 * @type {String}
 */
const correctColor = "rgb(51, 204, 51)";

/**
 * The color that displays when the button should not be clicked
 * @type {String}
 */
const incorrectColor = "rgb(255, 0, 0)";

/**
 * The maximun number of rounds
 * @type {Number}
 */
const maxRoundCount = 5;

/**
 * The process of changing the color
 */
var processChangeColor;

/**
 * The number of rounds that have passed
 * @type {Number}
 */
var roundCount;

/**
 * The results of the game
 * @type {Array}
 */
var reflexResults;

/**
 * The time when the color changes
 * @type {Number}
 */
var initialTime;

/**
 * Stores the average reaction time
 * @type {Array}
 */
var averageReactionTime;

/**
 * Init the application
 */
$(document).ready(function() {
  $("#reflexRestartButton").on("click", restart);
  $("#reflexExitButton").on("click", exit);
  init();
});

/**
 * Method that initializes the application
 */
function init() {
  // Set all the initial values of the application
  $(".reflexGame").css({"height":window.innerHeight, "width":window.innerWidth});
  $("#reflexMainButton").html("START");
  $("#reflexMainButton").css("background-color", "orange");
  $(".reflexResultsContainer").css("display", "none");
  reflexResults = new Array();
  roundCount = 0;
  averageReactionTime = 0;

  // Set the mains button initial event handler
  $("#reflexMainButton").off("click");
  $("#reflexMainButton").on("click", function() {
    startGame();
  });
}

/**
 * Starts the game
 */
function startGame() {
  $("#reflexMainButton").html("");
  $("#reflexMainButton").off("click");
  $("#reflexMainButton").on("click", function() {
    stop();
  });
  newRound();
}

/**
 * Initiates a new round for changing the color. It checks if the max number
 * of rounds has been reached.
 */
function newRound() {
  $("#reflexMainButton").css("backgroundColor", incorrectColor);
  if(roundCount == maxRoundCount) {
    setTimeout(finishGame, 1000);
  } else {
    roundCount++;
    time = Math.floor((Math.random() * (8000 - 2000)) + 2000);
    processChangeColor = setTimeout(changeColor, time);
  }
}

/**
 * Changes the color of the button.
 */
function changeColor() {
  $("#reflexMainButton").html("PRESS");
  $("#reflexMainButton").css("backgroundColor", correctColor);
  initialTime = new Date().getTime();
}

/**
 * This stops the execution to check how much time has passed since the color
 * changed to green
 */
function stop() {
  var final = new Date().getTime();
  var actualColor = $("#reflexMainButton").css("backgroundColor");
  if(actualColor == correctColor) {
    var resultado = final - initialTime;
    $("#reflexMainButton").html(resultado + "ms");
    reflexResults.push(resultado);
    newRound();
  } else {
    $("#reflexMainButton").html("You pressed too early...");
    clearTimeout(processChangeColor);
    roundCount--;
    newRound();
  }
}

/**
 * Finishes the game and shows the results
 */
function finishGame() {
  $(".reflexResultsContainer").css("display", "block");
  for (var i = 0; i < reflexResults.length; i++) {
    averageReactionTime += reflexResults[i];
  }
  averageReactionTime = Math.floor(averageReactionTime / roundCount);
  createTable();
}

/**
 * Creates the element table for the results and sets its id
 * @return the table created
 */
function createTable() {
  var table = document.createElement("table");
  table.setAttribute("id", "reflexResultTable");
  createTableHead(table);
  insertRows(table);
  $(".reflexMyResults").append(table);
}

/**
 * Creates the header for the results table
 * @param table The table where the header is going to be created
 */
function createTableHead(table) {
  var row;
  var th;
  var thText;

  row = document.createElement("tr");
  th = document.createElement("th");
  thText = document.createTextNode("Number");
  th.appendChild(thText);
  row.appendChild(th);
  table.appendChild(row);

  th = document.createElement("th");
  thText = document.createTextNode("Reflex Time");
  th.appendChild(thText);
  row.appendChild(th);
  table.appendChild(row);

  th = document.createElement("th");
  thText = document.createTextNode("Average Time");
  th.appendChild(thText);
  row.appendChild(th);
  table.appendChild(row);
}

/**
 * Inserts rows in the results table
 * @param table The table where the rows are going to be inserted
 */
function insertRows(table) {
  var row;
  var column;
  var columnText;

  for (var i = 0; i < reflexResults.length; i++) {
    row = document.createElement("tr");
    column = document.createElement("td");
    columnText = document.createTextNode(i + 1);
    column.appendChild(columnText);
    row.appendChild(column);

    column = document.createElement("td");
    columnText = document.createTextNode(reflexResults[i] + "ms");
    column.appendChild(columnText);
    row.appendChild(column);

    if(i == 0) {
      column = document.createElement("td");
      column.setAttribute("rowspan", roundCount);
      columnText = document.createTextNode(averageReactionTime + "ms");
      column.appendChild(columnText);
      row.appendChild(column);
    }
    table.appendChild(row);
  }
}

/**
 * Restarts the game.
 * Removes the results table and calls the init method
 */
function restart() {
  $("#reflexResultTable").remove();
  init();
}

/**
 * Method that exits the application
 */
function exit() {
  location.href = "../index.html";
}
