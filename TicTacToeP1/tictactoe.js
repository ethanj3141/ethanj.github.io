let currentPlayer = "X";
let gameStatus = "";
let numTurns = 0;

// take player turn
function playerTakeTurn(e) {
	if (e.innerHTML == "") {
		e.innerHTML = currentPlayer;
		checkGameStatus();
	} else {
		showLightBox("This box is already selected.","Please try another.")
		return;
	} // else
} // playerTakeTurn

// after each turn, check for a winnter, a tie,
// or continue playing
function checkGameStatus() {
	numTurns++; // iterate 
	
	// check for a win
	if (checkWin()) {
		gameStatus = currentPlayer + " wins!";
		showLightBox("Game Status:", gameStatus);
	}
	
	// check for tie
	if (numTurns == 9) {
		gameStatus = " Tie Game";
		showLightBox("Game Status:", gameStatus);
	} // numTurns
	
	// switch current player
	currentPlayer = (currentPlayer == "X") ? "O" : "X";
	
} // checkGameStatus

// check for a Win, there are 8 win paths
function checkWin() {
	let cb = []; // current board
	cb[1] = document.getElementById("one").innerHTML;
	cb[2] = document.getElementById("two").innerHTML;
	cb[3] = document.getElementById("three").innerHTML;
	cb[4] = document.getElementById("four").innerHTML;
	cb[5] = document.getElementById("five").innerHTML;
	cb[6] = document.getElementById("six").innerHTML;
	cb[7] = document.getElementById("seven").innerHTML;
	cb[8] = document.getElementById("eight").innerHTML;
	cb[9] = document.getElementById("nine").innerHTML;
	
	// top row
	if (cb[1] != "" && cb[1] == cb[2] && cb[2] == cb[3]) {
		return true;
	}
	// middle row
	if (cb[4] != "" && cb[4] == cb[5] && cb[5] == cb[6]) {
		return true;
	}
	// bottom row
	if (cb[7] != "" && cb[7] == cb[8] && cb[8] == cb[9]) {
		return true;
	}
	// left column
	if (cb[1] != "" && cb[1] == cb[4] && cb[4] == cb[7]) {
		return true;
	}
	// middle column
	if (cb[2] != "" && cb[2] == cb[5] && cb[5] == cb[8]) {
		return true;
	}
	// right column
	if (cb[3] != "" && cb[3] == cb[6] && cb[6] == cb[9]) {
		return true;
	}
	//topleft-bottomright diagonal
	if (cb[1] != "" && cb[1] == cb[5] && cb[5] == cb[9]) {
		return true;
	}
	//topright-bottomleft diagonal
	if (cb[3] != "" && cb[3] == cb[5] && cb[5] == cb[7]) {
		return true;
	}
}

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
	
} // continueGame