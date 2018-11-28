var view = {
	displayMessage: function (msg) { 
		var messageArea = document.getElementById('messageArea');
		messageArea.innerHTML = msg;
	},
	displayHit: function (location) {  
		var cell = document.getElementById(location)
		cell.setAttribute('class', 'hit');
	},
	displayMiss: function (location) {  
		var cell = document.getElementById(location)
		cell.setAttribute('class', 'miss');
	}
};

var model = { 
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	shipsSunk: 0,
	ships:  [{ locations: [], hits: [] },
			 	{ locations: [], hits: [] },
				{ locations: [], hits: [] }],

	fire: function (guess) {  
		for (let i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess);
			if (ship.hits[index] === "hit") {
				view.displayMessage("Oops, you already hit that location!");
				return true;
			} else if (index >= 0) {
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("HIT!");

				if (this.isSunk(ship)) {
					view.displayMessage("You sank my battleship!");
					this.shipsSunk++;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("You missed.");
		return false;
	},

	isSunk: function(ship){
		for (let i = 0; i < this.shipLength; i++) {
			if (ship.hits[i] !== 'hit'){
				return false;
			}
		}
		return true; 
	},

	generateShipLocations: function() {
		var locations;
		for (var i = 0; i < this.numShips; i++) {
			do {
				locations = this.generateShip();
			} while (this.collision(locations));
			this.ships[i].locations = locations;
		}	
		console.log("Ships array: ");
		console.log(this.ships[0].locations);
		console.log(this.ships[1].locations);
		console.log(this.ships[2].locations);
	},

	generateShip: function() {
		var direction = Math.floor(Math.random() * 2);
		var row, col;
		if (direction === 1) {
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
		} 
		else {
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
			col = Math.floor(Math.random() * this.boardSize);
		}

		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));
			}
			else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
	},

	collision: function(locations) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = model.ships[i];
			for (var j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	}
};

var controller = {
	guesses: 1,
	gameOver: false,
	
	processGuess: function (guess) {  
		var location = parseGuess(guess);
		if (location) {
			var hit = model.fire(location);
			if (hit && model.shipsSunk === model.numShips) {
				view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses");
				return this.gameOver = true;
			}
			else if(this.gameOver == false){
				this.guesses++;
			}
		}
	}
};

function parseGuess(guess) {
	var row = guess.charAt(0);
	var column = guess.charAt(1);
	
	return row + column;
};

var newGame = {
	game: 1,

	newGame: function () {
		var clearCell = document.getElementsByTagName('td');
		for (let i = 0; i < clearCell.length; i++) {
			const el = clearCell[i];
			el.setAttribute('class', '');
		}
		controller.gameOver = false;
		model.shipsSunk = 0;
		model.ships =  [{ locations: [], hits: [] },
		{ locations: [], hits: [] },
		{ locations: [], hits: [] }];
		controller.guesses = 1;
		init();
	}
};

function onCellClick() {
	var getTableCells = document.getElementsByTagName('td');
	
	for (let i = 0; i < getTableCells.length; i++) {
		const cell = getTableCells[i];
		cell.onclick = function () {
			if (controller.gameOver == false) {
				var cellID = cell.id;
				controller.processGuess(cellID);
			} else {
				alert("Round " +newGame.game+  " finished. Start new game?");	
				newGame.game++;
				newGame.newGame();
			}
		}
	}
};

function init () {
	model.generateShipLocations();
	onCellClick()
};

window.onload = init;