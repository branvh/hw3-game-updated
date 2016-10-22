
//DECLARE VARIABLES
	//Array of hangman words - variable
	var words = ["brandon", "harbaugh", "random", "michigan", "cider"]
	var currentWord;

	//Guess tracking variable
	var difficulty = 7;
	var guessesRemaining = difficulty;
	var userGuess;

	//Win tracking variables
	var wins = 0;
	var pointsNeeded = 0;
	var gameOver = false;

	//Arrays to display game results, real-time (correct and incorrect guesses)
	var displayText = [];
	var lettersGuessed = [];

document.getElementById('start-button').addEventListener('click', function () {
	
	var hideBtn = document.getElementById('start-button');
	hideBtn.style.display = 'none';

	var replacementBtn = document.getElementById('try-again-button');
	replacementBtn.style.display = 'initial';

	var displayInstructions = document.getElementById('instructions');
	displayInstructions.style.visibility = 'initial';

	var displayChoices1 = document.getElementById('letter-row-1');
	displayChoices1.style.visibility = 'initial';

	var displayChoices2 = document.getElementById('letter-row-2');
	displayChoices1.style.visibility = 'initial';

	//unselect button
	this.blur();

	//begin game when start button clicked
	startGame();

});

//Upon start, add an event listener to enable page resets upon pressing try-again
document.getElementById('try-again-button').addEventListener('click', function () {
	//unselect button
	this.blur();

	//start another game round
	resetPage();
 
});

function startGame () {

	//create a new random word
	generateWord ();
	console.log("current word is: " + currentWord);
	console.log("points needed are: " + pointsNeeded);

	//load a blank word text
	loadBlankWord ();

	// Display word text .... it is blank if the game hasn't started / starting new game
	displayWord (displayText);

	//play game, which includes event listener to look for keystrokes
	controlGame ();

	//once control game exits, end game and re-start upon pressing try-again
	return;
}

//GAMEPLAY FUNCTIONS
function generateWord () {
	var i = Math.floor(Math.random()*words.length);
	currentWord = words[i];
	
	//define points needed to win based on word length
	pointsNeeded = currentWord.length;
}

function loadBlankWord () {
	for (var i = 0; i < currentWord.length; i++){
		displayText.push("_   ");
	}

	//load guesses remaining text as well
	document.getElementById('guesses-remaining').textContent = guessesRemaining;

	//load wins as well
	document.getElementById('win-count').textContent = wins;
}

function controlGame () {

	clickListener();

}


function displayWord (inputArray) {

	//display the array that holds the blank word and subsequent updates from correct guesses
	document.getElementById('current-word').textContent = inputArray.join(" ");

}

function checkGuess () {

	var updated = false;

	//don't run through check if already guessed a letter
	if (lettersGuessed.indexOf(userGuess) === 0 || userGuess === ''){
		return;
	}

	for (var i = 0; i < currentWord.length; i++) {

		//must check every letter in word due to chance for repeat letters
		if (currentWord[i] === userGuess) {

			//update text to display correctly guessed letter
			displayText[i] = (userGuess + "     ");

			//reduce points needed with each successful letter...index of prevents double scoring if you guess same letter twice
			if (lettersGuessed.indexOf(userGuess) === -1){
				pointsNeeded--;
				console.log('earned point');
			}
				//set flag that skips bad guess check in else-if below
				updated = true;
		}	
	}	

	// update hangman word if the displayText was updated
	if (updated === true) {
		displayWord(displayText);
		lettersGuessed.push(userGuess);
	}
	else if (lettersGuessed.indexOf(userGuess) === -1){
	//update bad guess array....if not updated, then this must occur before function exit
		lettersGuessed.push(userGuess);

		//update text on screen to reflect bad guess
		// document.getElementById('letters-guessed').textContent = lettersGuessed.toString();

		//reduce guesses remaining by 1, but don't let go negative
		if (guessesRemaining > 0) {
			guessesRemaining--;
		}
		//update guesses remaining on screen
		document.getElementById('guesses-remaining').textContent = guessesRemaining;
		console.log("updated guesses remaining");
		
	}	
}


function winCheck () {

	if (pointsNeeded === 0) {
		alert("you won!");

		//update win count and win text on screen
		wins++;
		document.getElementById('win-count').textContent = wins;

		//empty out user guess
		userGuess = '';

		//enable game to end
		resetPage();
	 
	}
	else if (guessesRemaining === 0) {
		alert("you lost, press play again");

		//empty out user guess
		userGuess = '';

		//enable game to end
		resetPage();
	}

	//otherwise, just continue playing

}


function resetPage (){
	//no need to load blank word as sequencing after event listener loads / displays

	//reset all variables
	guessesRemaining = difficulty;
	displayText = [];
	lettersGuessed = [];
	gameOver = false;
	userGuess = '';

	//change all text back to defaults
	document.getElementById('current-word').textContent = "";
	document.getElementById('guesses-remaining').textContent = guessesRemaining;
	// document.getElementById('letters-guessed').textContent = "";

	//reset buttons
	var buttons = document.querySelectorAll(".letter-choice");
	
	for (var i = 0; i < buttons.length; i++) {
			buttons[i].style.color = '';
			buttons[i].blur();
	}

	console.log("reset guessremain / game over to " + guessesRemaining + gameOver );
	startGame();
}

function clickListener () {

	var buttons = document.querySelectorAll(".letter-choice");
	for ( var i =0; i < buttons.length; i++) {

		buttons[i].style.visibility = 'visible'; 

	    if (document.addEventListener) {
	        buttons[i].addEventListener("click", function() {
	            userGuess = this.innerHTML;

	            //remove selected status 
	            this.blur();
	            this.style.color = 'red';

	            checkGuess ();  
				// Check for win
				winCheck ();

				//end game 
				if (gameOver){ 
					return;
					console.log("game over status: " + gameOver);
				}

	        });
	    } else {
	        buttons[i].attachEvent("onclick", function() {
	            userGuess = this.innerHTML;

	            //remove selected status 
	            this.blur();
	            this.style.color = 'red';

	            checkGuess ();  
				// Check for win
				winCheck ();

				//end game 
				if (gameOver){ 
					return;
					console.log("game over status: " + gameOver);
				}

	        });
	    };

	}  
}