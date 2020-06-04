const levels = [

	// level 1
	["flag", "rock", "", "" , "",
	"fenceside", "rock", "", "" , "rider",
	"", "tree", "animate", "animate", "animate",
	"", "water", "", "", "",
	"", "fence", "", "horseup", ""],
	
	// level 2
	["flag", "water", "", "", "",
	"fenceside", "water", "", "", "rider",
	"animate", "bridge animate", "animate", "animate", "animate",
	"", "water", "", "", "",
	"", "water", "", "", "",
	"", "water", "horseup", "", ""],
	
	// level 3
	["tree", "tree", "flag", "tree", "tree",
	"animate", "animate", "animate", "animate", "animate",
	"water", "bridge", "water", "water", "water",
	"", "", "", "fence", "",
	"rider", "rock", "", "", "horseup"]
]; // end of levels

const gridBoxes = document.querySelectorAll("#gameBoard div");
var currentLevel = 0; // starting level
var riderOn = false; // is rider on horse?
var currentLocationOfHorse = 0;
var currentAnimation; // allows 1 animation per level

// start game
window.addEventListener("load", function () {
	loadLevel();
});


// loadlevels 0 - maxLevel
function loadLevel() {
	let levelMap = levels[currentLevel];
	let animateBoxes;
	riderOn = false;
	
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
	// exit function if no animation
	if(boxes.length <= 0) { console.log("none"); return; }
	
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
	
	currentAnimation = setTimeout(function () {animateEnemy(boxes, index, direction);}, 750);
} // animateEnemy