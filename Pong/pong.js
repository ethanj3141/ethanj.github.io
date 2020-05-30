/*  Added Features:
	Every time the ball bounces off the top, the bottom, or a paddle, it's speed increases by 5%. This is reset whenever a point is scored.
	Every time a point is scored, the ball's speed increases by 5%. This is reset whenever the game is restarted.
	Assorted CSS and HTMl alterations to improve the user inteface.
	If a player has a advantage of more then 2 points, the ball will vector away from their paddle on their side of the gameboard.
	The game automatically stops and displays the winner when some side reaches 10 points.
	
	Known Bugs: Does not handle changes in screen resolution (or screen size) well. Refresh to fix.
*/

// global variables
var speedOfPaddle1 = 0;
var positionOfPaddle1 = document.getElementById("paddle1").offsetTop;
var speedOfPaddle2 = 0;
var positionOfPaddle2 = document.getElementById("paddle2").offsetTop;

const paddleHeight = document.getElementById("paddle2").offsetHeight;
const paddleWidth = document.getElementById("paddle1").offsetWidth;

const gameBoardHeight = document.getElementById("gameBoard").offsetHeight;
const gameBoardWidth = document.getElementById("gameBoard").offsetWidth;

const ballHeight = document.getElementById("ball").offsetHeight;

const startTopPositionOfBall = document.getElementById("ball").offsetTop;
const startLeftPositionOfBall = document.getElementById("ball").offsetLeft;

var topPositionOfBall = startTopPositionOfBall;
var leftPositionOfBall = startLeftPositionOfBall;
var topSpeedOfBall = 0;
var leftSpeedOfBall = 0;
var speedMod = 1;

var score1 = 0;
var score2 = 0;

var bounce = new sound("bounce.mp3");
var goal = new sound("goal.mp3");

var play = false;
var game;

document.addEventListener('keydown', function(e) {
	if (e.keyCode == 87 || event.which == 87) { // W
		speedOfPaddle1 = -10;
	} // if
	
	if (e.keyCode == 83 || event.which == 83) { // S
		speedOfPaddle1 = 10;
	} // if
	
	if (e.keyCode == 38 || event.which == 38) { // uparrow
		speedOfPaddle2 = -10;
	} // if
	
	if (e.keyCode == 40 || event.which == 40) { // downarrow
		speedOfPaddle2 = 10;
	} // if
});

document.addEventListener('keyup', function(e) {
	if (e.keyCode == 87 || event.which == 87) {
		speedOfPaddle1 = 0;
		
	} // if
	
	if (e.keyCode == 83 || event.which == 83) {
		speedOfPaddle1 = 0;
		
	} // if
	
	if (e.keyCode == 38 || event.which == 38) {
		speedOfPaddle2 = 0;
		
	} // if
	
	if (e.keyCode == 40|| event.which == 40) {
		speedOfPaddle2 = 0;
		
	} // if
});

// 'makes' ball
function makeBall() {
	document.getElementById("ball").style.backgroundColor = "red";
	document.getElementById("gameEnd").style.display = "none";
	play = true;
	game = true;
	score1 = 0;
	score2 = 0;
	speedMod = 1;
	startBall();
}

// start and stops game
function playNow(startOrStop) {
	if (startOrStop == "start") {
		play = true;
	} else {
		play = false;
	}
} // playNow

// disappear the ball, pause time, show game result
function endGame() {
	game = false;
	document.getElementById("gameEnd").style.display = "block";
	document.getElementById("ball").style.backgroundColor = "#cce6ff";
	if (score1 > score2) {
		document.getElementById("gameEnd").innerHTML = "Player 1 has won the game! Press play for new game.";
	} else if (score2 > score1) {
		document.getElementById("gameEnd").innerHTML = "Player 2 has won the game! Press play for new game.";
	} else {
		document.getElementById("gameEnd").innerHTML = "Tie! Press Play for new game.";
	} // else
} // endGame

// object constructor to play sounds
// https://www.w3schools.com/graphics/game_sound.asp
function sound(src) {
	this.sound = document.createElement("audio");
	this.sound.src = src;
	this.sound.setAttribute("preload", "auto");
	this.sound.setAttribute("controls", "none");
	this.sound.style.display = "none";
	document.body.appendChild(this.sound);
	this.play = function(){
		this.sound.play();
	}
	this.stop = function(){
		this.sound.pause();
	}
} // sound

// start the ball at it's starting position and new random direction
function startBall() {
	let direction = 1;
	topPositionOfBall = startTopPositionOfBall;
	leftPositionOfBall = startLeftPositionOfBall;
	
	// 50% chance of starting in either direction (right or left)
	if (Math.random() < 0.5) {
		direction = 1;
	} else {
		direction = -1;
	} // else
	
	topSpeedOfBall = Math.random() * 2 + 3; //3-4.9999
	leftSpeedOfBall = direction * (Math.random() * 2 + 3);
} // startBall

// update locations of paddle and ball
window.setInterval(function show () {
	
	if (play == true && game == true) {
	
		let paddleHeight = document.getElementById("paddle1").offsetHeight;
		let gameBoardHeight = document.getElementById("gameBoard").offsetHeight;
		
		// update positions of elements
		positionOfPaddle1 += speedOfPaddle1;
		positionOfPaddle2 += speedOfPaddle2;
		topPositionOfBall += topSpeedOfBall * speedMod;
		leftPositionOfBall += leftSpeedOfBall * speedMod;
		
		// make ball path veer away from paddle of advantaged player
		if (Math.random() > 0.5) {
			if (leftPositionOfBall < startLeftPositionOfBall && score1 - 2 > score2) {
				if (topPositionOfBall < positionOfPaddle1) {
					topSpeedOfBall -= 0.09;
					console.log("up");
				} else {
					topSpeedOfBall += 0.09;
					console.log("down");
				} // else
			} // if
			if (leftPositionOfBall > startLeftPositionOfBall && score2 - 2 > score1) {
				if (topPositionOfBall < positionOfPaddle2) {
					topSpeedOfBall -= 0.09;
					console.log("up");
				} else {
					topSpeedOfBall += 0.09;
					console.log("down");
				} // else
			} // if
		} // if
		
		// stop paddle from leaving top of gameboard
		if (positionOfPaddle1 <= 0) {
			positionOfPaddle1 = 0;
		}
		
		if (positionOfPaddle2 <= 0) {
			positionOfPaddle2 = 0;
		}
		
		// stop paddles from leaving bottom of gameboard
		if (positionOfPaddle1 >= gameBoardHeight - paddleHeight) {
			positionOfPaddle1 -= 10;
		}
		if (positionOfPaddle2 >= gameBoardHeight - paddleHeight) {
			positionOfPaddle2 -= 10;
		}
		
		// if ball hits top, or bottom, of gameboard, change direction
		if (topPositionOfBall <= 0 || topPositionOfBall >= gameBoardHeight - ballHeight) {
			topSpeedOfBall *= -1.05;
			leftSpeedOfBall *= 1.05;
			bounce.play();
		} // if
		
		// ball on the left edge of gameboard
		if (leftPositionOfBall <= paddleWidth) {
			
			// if ball hits left paddle, change direction
			if(topPositionOfBall > positionOfPaddle1 && topPositionOfBall < positionOfPaddle1 + paddleHeight) {
				leftSpeedOfBall *= -1.05;
				leftSpeedOfBall *= 1.05;
				bounce.play();
			} else {
				goal.play();
				startBall();
				score2 += 1;
				speedMod *= 1.05;
				document.getElementById("score2").innerHTML = score2;
			} // else
		} // if

		
		// ball on the right edge of gameboard
		if (leftPositionOfBall  >= gameBoardWidth - paddleWidth - ballHeight) {
			
			// if ball hits right paddle, change direction
			if(topPositionOfBall > positionOfPaddle2 && topPositionOfBall < positionOfPaddle2 + paddleHeight) {
				leftSpeedOfBall *= -1.05;
				leftSpeedOfBall *= 1.05;
				bounce.play();
			} else {
				goal.play();
				startBall();
				score1 += 1;
				speedMod *= 1.05;
				document.getElementById("score1").innerHTML = score1;
			} // else
		} // if
	
		document.getElementById("paddle1").style.top = positionOfPaddle1 + "px";
		document.getElementById("paddle2").style.top = positionOfPaddle2 + "px";
		document.getElementById("ball").style.top = topPositionOfBall + "px";
		document.getElementById("ball").style.left = leftPositionOfBall + "px";
	} // if
	
	if (score1 == 10 || score2 == 10) {
		endGame();
	}
	
}, 1000/60);  // show