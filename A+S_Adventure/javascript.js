/*
Notes to self: sped up enemy to 600, added keyspam limitation 

todo: swap speeds for without and with rider, add run-up requirement for fence jumping

story: the overweight doofus with the 5-sided hat.
Spangler keeps getting into trouble
*/

const levels = [

	// level 1
	["flag", "tree2", "tree", "" , "waters",
	"fenceside", "rock", "", "" , "rider",
	"", "tree", "animate", "animate", "animate",
	"", "waters", "", "", "",
	"", "fenceup", "", "horseup", ""],

	// level 2
	["flag", "water", "", "", "tree2",
	"fenceside", "water", "tree", "", "rider",
	"animate", "bridge animate", "animate", "animate", "animate",
	"", "water", "", "", "",
	"", "water", "horseup", "", "waters"],
	
	// level 3
	["tree", "tree2", "flag", "tree2", "tree",
	"animate", "animate", "animate", "animate", "animate",
	"waterr", "bridge", "waterr", "waterr", "waterr",
	"", "", "", "", "",
	"rider", "rock", "tree", "tree", "horseup"],
	
	// level 4
	["horsedown", "water", "", "tree2", "rider",
	"", "water", "", "", "",
	"animate", "bridge animate", "animate", "animate", "",
	"", "water", "fenceside", "rock", "waters",
	"", "water", "", "", "flag"],
	
	// level 5
	["flag", "flag", "flag", "flag", "flag",
	"", "", "", "", "",
	"fenceside", "fenceside", "fenceside", "fenceside", "fenceside",
	"animate", "animate", "animate", "animate", "animate",
	"waters", "rider", "tree", "rock", "horseup"]
	
]; // end of levels

const gridBoxes = document.querySelectorAll("#gameBoard div");
const noPassObstacles = ["rock", "tree", "tree2", "water", "waterr", "waters", "waterc"];

var currentLevel = 0; // starting level
var riderOn = false; // is rider on horse?
var currentLocationOfHorse = 0;
var currentAnimation; // allows 1 animation per level
var widthOfBoard = 5;
var canMove = true;
var speed = 150;
var currentlyJumping = false; // prevent glitched horses from trying to move while jumping
var haveRunup = [false, false]; //1st is whether there's a runup, 2cnd is whether r-to-l

// start game
window.addEventListener("load", function () {
	loadLevel();
});

// move horse
document.addEventListener("keydown", function (e) {
	if (canMove == true && currentlyJumping == false) {
		switch (e.keyCode) {
			case 37: // left arrow
				if (currentLocationOfHorse % widthOfBoard !== 0) {
					tryToMove("left");
					canMove = false;
					setTimeout(function(){canMove = true;}, speed); //can move faster with rider
				}
				break;
			case 38: // up arrow	
				if (currentLocationOfHorse - widthOfBoard >= 0) {
					tryToMove("up");
					canMove = false;
					setTimeout(function(){canMove = true;}, speed);
				}
				break;
			case 39: // right arrow
				if (currentLocationOfHorse % widthOfBoard < widthOfBoard - 1) {
					tryToMove("right");
					canMove = false;
					setTimeout(function(){canMove = true;}, speed);
				}
				break;		
			case 40: // down arrow
				if (currentLocationOfHorse + widthOfBoard < 25) {
					tryToMove("down");
					canMove = false;
					setTimeout(function(){canMove = true;}, speed);
				}
				break;
		} // switch
	}
}); // key event listener

function tryToMove (direction) {
	
	// location before move
	let oldLocation = currentLocationOfHorse;
	
	// class of location before move
	let oldClassName = gridBoxes[oldLocation].className;
	
	let nextLocation = 0; // location we wish to move to
	let nextClass = ""; // class of location we wish to move to
	
	let nextLocation2 = 0;
	let nextClass2 = "";
	
	let newClass = ""; // class to switch to if move successful
	
	switch (direction) {
		case "left":
			nextLocation = currentLocationOfHorse - 1;
			break;
		case "right":
			nextLocation = currentLocationOfHorse + 1;
			break;
		case "up":
			nextLocation = currentLocationOfHorse - 5;
			break;
		case "down":
			nextLocation = currentLocationOfHorse + 5;
			break;
	} //
	
	nextClass = gridBoxes[nextLocation].className;
	
	// if the obstacle is not passable, don't move
	if (noPassObstacles.includes(nextClass)) { return; }
	
	// if it's a fence, and there is no rider, don't move
	if (!riderOn && nextClass.includes("fence")) { return; }
	
	if (direction == "left" || direction == "right") {//figure out 4 directions of fence
		haveRunup = [true, true];
	}
	
	// if there is a fence, move two spaces with animation
	if (nextClass.includes("fence")) {
		
		// horse requires rider to jump
		if (riderOn) {
			
			currentlyJumping = true; // can't move other ways
			gridBoxes[currentLocationOfHorse].className = "";
			oldClassName = gridBoxes[nextLocation].className;
			
			// set values according to direction
			if (direction == "left") {
				nextClass = "jumpleft";
				nextClass2 = "horserideleft";
				nextLocation2 = nextLocation - 1;
			} else if (direction == "right") {
				nextClass = "jumpright";
				nextClass2 = "horserideright";
				nextLocation2 = nextLocation + 1;
			} else if (direction == "up") {
				nextClass = "jumpup";
				nextClass2 = "horserideup";
				nextLocation2 = nextLocation - widthOfBoard;
			} else if (direction == "down") {
				nextClass = "jumpdown";
				nextClass2 = "horseridedown";
				nextLocation2 = nextLocation + widthOfBoard;
			}
			
			// show horse jumping
			gridBoxes[nextLocation].className = nextClass;
			
			setTimeout(function() {
				
				// set jump back to just a fence
				gridBoxes[nextLocation].className = oldClassName;
				
				// update current location of horse to be 2 spaces past take off
				currentLocationOfHorse = nextLocation2;
				
				// get class of box after jump
				nextClass = gridBoxes[currentLocationOfHorse].className;
				
				// show horse and rider after landing
				gridBoxes[currentLocationOfHorse].className = nextClass2;
				
				currentlyJumping = false; // jump over
				
				// next box is a flag, go up a level
				levelUp(nextClass);
				
			}, 350);
			return;
		}
	} // if class has fence
	
	// if if there is a rider, add rider 
	if (nextClass == "rider") {
		speed = 500; // rider heavy
		riderOn = true;
	}
	
	// if there is a bridge in the old location keep it
	if (oldClassName.includes("bridge")) {
		gridBoxes[oldLocation].className = "bridge";
	} else {
		gridBoxes[oldLocation].className = "";
	}

	// build name of new class
	newClass += (riderOn) ? "horseride" : "horse";
	newClass += direction;
	
	// if there is a bridge in the next location, keep it
	if (gridBoxes[nextLocation].classList.contains("bridge")) {
		newClass += " bridge";
	}
	
	// move 1 space
	currentLocationOfHorse = nextLocation;
	gridBoxes[currentLocationOfHorse].className = newClass;
	
	// if it is an enemy
	if (nextClass.includes("enemy")) {
		endGame(false, false);
		return;
	}
	
	// move up a level if appropriate
	levelUp(nextClass);
	
} // tryToMove

// move up a level
function levelUp (nextClass) {
	if (nextClass == "flag" && riderOn) {
		clearTimeout(currentAnimation);
		if (currentLevel < 4) {
			document.getElementById("levelup").style.display = "block";
			currentLevel++;
		} else {
			endGame(true, false); //victory, and not the restart button
			return;
		}
		setTimeout (function() {
			document.getElementById("levelup").style.display = "none";
			loadLevel();
		}, 2000);
	}
}

// loadlevels 0 - maxLevel
function loadLevel() {
	document.getElementById("lose").style.display = "none";
	document.getElementById("levelup").style.display = "none";
	
	//remove new game button upon new game starting
	document.getElementById("levelup").innerHTML = "Enemy Escaped! Onward!"; 
	
	let levelMap = levels[currentLevel];
	let animateBoxes;
	riderOn = false;
	speed = 150;
	
	// load board
	for (i = 0; i < gridBoxes.length; i++) {
		gridBoxes[i].className = levelMap[i];
		if (levelMap[i].includes("horse")) currentLocationOfHorse = i;
	} // for
	
	animateBoxes = document.querySelectorAll(".animate");
	
	animateEnemy(animateBoxes, 0, "right");
	
} //loadLevel

/* animate enemy left to right (note to self consider adding up and down)
boxes - array of grid boxes that include animation
index is current location of animation
direction is current direction of enemy
*/
function animateEnemy(boxes, index, direction) {
	let nextPlace = String(boxes[index].className); //where is the enemy next?
	
	// exit function if no animation
	if(boxes.length <= 0) {return;}
	
	//update images
	if (direction == "right") {
		boxes[index].classList.add("enemyright");
	} else {
		boxes[index].classList.add("enemyleft");
	} // else
	
	// remove images from other boxes
	for (var i = 0; i < boxes.length; i++) {
		if (i != index) {
			boxes[i].classList.remove("enemyright");
			boxes[i].classList.remove("enemyleft");
		} // if
	} // for
		
	// hitting player character
	if (nextPlace.includes('horse')) {
		endGame(false, false);
		return;
	}
	
	// moving right
	if (direction == "right") {
		// turn around if hit right side
		if (index == boxes.length - 1) {
			index--;
			direction = "left";
		} else {
			index ++;
		} // else
			
	// moving left
	} else {
		// turn around if hit left side
		if (index == 0) {
			index ++;
			direction = "right";
		} else {
			index--;
		} // else
	} // else
	
	if (currentLevel == 4 && index == 0) {
		setTimeout(function () {}, 50);
	}
	
	currentAnimation = setTimeout(function () {animateEnemy(boxes, index, direction);}, 600);
} // animateEnemy

// go to a appropriate end game screen
function endGame(victory, isRestart) {
	
	clearTimeout(currentAnimation);
	speed = 150; // normal speed
	currentLevel = 0; // starting level
	riderOn = false; // is rider on horse?
	currentLocationOfHorse = 0;
	
	if (isRestart == false) {
		if (victory) {
			document.getElementById("levelup").innerHTML = "Zzzzzzzzzzz... (The stable really <span class = 'i'>is</span> comfy.) <span class = 'link' onclick = 'loadLevel()'>Click this for New Game</span>";
		} else {
			document.getElementById("lose").style.display = "block";
		}
	} else {
		loadLevel();
		isRestart = false;
	}
}