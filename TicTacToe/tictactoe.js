let currentPlayer = "X";
let gameStatus = "";
let numTurns = 0;
let idNames = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]
let testBoard = new Array(9);

// 0.1 seconds after the page finishes loading, the computer takes a turn
setTimeout(function () {computerTakeTurn(); checkGameStatus();}, 250);

// reset board and all variables
function newGame() {
	
	// reset board
	for (var i = 0; i < idNames.length; i++) {
		document.getElementById(idNames[i]).innerHTML = "";
	} // for
	
	numTurns = 0;
	gameStatus = "";
	numTurns = 0;
	currentPlayer = "X";
	
	changeVisibility("controls");
	
	setTimeout(
		function () {
			computerTakeTurn();
			checkGameStatus();
		}, 
		50
	);
} // newGame

// take player turn
function playerTakeTurn(e) {
	if (e.innerHTML == "") {
		e.innerHTML = currentPlayer;
		checkGameStatus();
		
		// if game is not over, computer goes
		if (gameStatus == "") {
			setTimeout(
				function () {
					computerTakeTurn();
					checkGameStatus();
				}, 
				500
			);
		} // if
		
	} else {
		showLightBox("This box is already selected.","Please try another.");
		return;
	} // else
} // playerTakeTurn

function computerTakeTurn() {
	let idName = "";
	let testBoard = [];
	let threeInFourChance = Math.random(); 
	
	// fill testBoard with the real board
	for (var i = 0; i < 9; i++) {
		testBoard[i + 1] = document.getElementById(idNames[i]).innerHTML;
	} // for
	
	// if there's a winning move, take it
	for (var i = 0; i < 9; i++) {
		if (testBoard[i + 1] == "" && checkIfWin(i, testBoard)) {
			document.getElementById(idNames[i]).innerHTML = currentPlayer;
			return;
		} // if
	} // for
	
	// switch current player for testing purposes
	currentPlayer = "O";
	
	for (var i = 0; i < 9; i++) {
		if (testBoard[i + 1] == "" && checkIfWin(i, testBoard)) {
			// switch current player to counter enemy winning move, then break becuase if 
			// there's two ways for the human player to win, the AI has can't win anymore
			currentPlayer = "X";
			document.getElementById(idNames[i]).innerHTML = currentPlayer;
			return;
		}// if
	} // for
	
	currentPlayer = "X";
	
	// 75% chance of checking for a few ways of simultaneously creating 2 ways to win in 1 move (ensuring that both can't be blocked)
	if (threeInFourChance > 0.25) {
		if (numTurns > 4 && numTurns < 6) { // at some points in the game, these situations just don't appear
			if (document.getElementById("two").innerHTML == currentPlayer) {
				if (document.getElementById("four").innerHTML == currentPlayer && document.getElementById("three").innerHTML == "" && document.getElementById("seven").innerHTML == "" && document.getElementById("one").innerHTML == "") {
					document.getElementById("one").innerHTML = currentPlayer;
					return;
				} // if
				if (document.getElementById("six").innerHTML == currentPlayer && document.getElementById("one").innerHTML == "" && document.getElementById("nine").innerHTML == "" && document.getElementById("three").innerHTML == "") {
					document.getElementById("three").innerHTML = currentPlayer;
					return;
				} // if
			} // if
		
			if (document.getElementById("eight").innerHTML == currentPlayer) {
				if (document.getElementById("four").innerHTML == currentPlayer && document.getElementById("one").innerHTML == "" && document.getElementById("nine").innerHTML == "" && document.getElementById("seven").innerHTML == "") {
					document.getElementById("seven").innerHTML = currentPlayer;
					return;
				} // if
				if (document.getElementById("six").innerHTML == currentPlayer && document.getElementById("seven").innerHTML == "" && document.getElementById == "three" && document.getElementById("nine").innerHTML == "") {
					document.getElementById("nine").innerHTML = currentPlayer;
					return;
				} // if
			} // if
		} // if
	} // if 

	currentPlayer = "X";
	
	//otherwise, choose random box until empty box is found
	do {
		let rand = parseInt(Math.random() * 9); // 0-8
		idName = idNames[rand]
		if (document.getElementById(idName).innerHTML == "") {
			document.getElementById(idName).innerHTML = currentPlayer;
			break;
		} // if
	} while (true); // do-while
} // computerTakeTurn

// after each turn, check for winners, ties, or the game remaining unfinished
function checkGameStatus() {
	numTurns++; // iterate 
	
	// check for a win
	if (checkWin()) {
		gameStatus = currentPlayer + " wins!";
		showLightBox("Game Status:", gameStatus);
	}
	
	// check for tie
	if (numTurns >= 9) {
		gameStatus = " Tie Game";
		showLightBox("Game Status:", gameStatus);
	} // numTurns
	
	// switch current player
	currentPlayer = (currentPlayer == "X") ? "O" : "X";
	
} // checkGameStatus

// returns true if the specified move would let the current player win
function checkIfWin (movePlace, testBoard) {
	var cbTest = [];
	for (var i = 0; i < 9; i++) {
		cbTest[i + 1] = testBoard[i + 1];
	}
	
	cbTest[movePlace + 1] = currentPlayer;
	
	if (victoryCheck(cbTest)) {
		return true;
	} // if
} // checkIfWin

// returns true if the actual board contains a row of three
function checkWin() {
	let cb = []; // current board
	
	for (var i = 1; i < 10; i++) {
		cb[i] = document.getElementById(idNames[i-1]).innerHTML; // set up a loop for the conversion of the board into a array
	} // for
	
	if (victoryCheck(cb)) {
		return true;
	} // if
} // checkWin

// consolidate both instances of the 7 victory condition checks into 1 function
function victoryCheck (cb) {
	
	// top row
	if (cb[1] != "" && cb[1] == cb[2] && cb[2] == cb[3]) {
		return true;
	} // if
	
	// middle row
	if (cb[4] != "" && cb[4] == cb[5] && cb[5] == cb[6]) {
		return true;
	} // if
	
	// bottom row
	if (cb[7] != "" && cb[7] == cb[8] && cb[8] == cb[9]) {
		return true;
	} // if
	
	// left column
	if (cb[1] != "" && cb[1] == cb[4] && cb[4] == cb[7]) {
		return true;
	} // if
	
	// middle column
	if (cb[2] != "" && cb[2] == cb[5] && cb[5] == cb[8]) {
		return true;
	} // if
	
	// right column
	if (cb[3] != "" && cb[3] == cb[6] && cb[6] == cb[9]) {
		return true;
	} // if
	
	// topleft-bottomright diagonal
	if (cb[1] != "" && cb[1] == cb[5] && cb[5] == cb[9]) {
		return true;
	} // if
	
	// topright-bottomleft diagonal
	if (cb[3] != "" && cb[3] == cb[5] && cb[5] == cb[7]) {
		return true;
	} // if
} // victoryCheck

// change the visibility of divID
function changeVisibility (divId) {
	var element = document.getElementById(divId);
	
	// if element exists, toggle its class
	// between hidden and unhidden
	if (element) {
		element.className = (element.className == 'hidden')?'unhidden' : 'hidden';
	} // if
} // changeVisibility

// display message in lightbox
function showLightBox(message,message2) {
	
	// set 
	document.getElementById("message").innerHTML = message;
	document.getElementById("message2").innerHTML = message2;
	
	// show lightbox
	changeVisibility("lightbox");
	changeVisibility("boundaryMessage");
}

// close lightbox
function continueGame() {
	changeVisibility("lightbox");
	changeVisibility("boundaryMessage");
	
	// if the game is over, show controls
	if (gameStatus != "") {
		changeVisibility("controls");
	}
} // continueGame