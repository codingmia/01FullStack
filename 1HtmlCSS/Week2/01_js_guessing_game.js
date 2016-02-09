var colors = ["blue", "cyan", "gold", "gray", "green", "magenta", "orange", "red", "white", "yellow"];
var allColors = colors.join(); //Convert array to text

var guess_input;
var question = "I am thinking of one of these colors:\n\n" + 
"blue, cyan, gold, gray, green, magenta, orange, red, white, yellow\n\n"+
"What color am I thinking of?\n";
var invalidMsg = "Sorry, I don't recognize your color.\n\n" +
"Please try again.";
var lowerMsg = "Sorry, your guess is not correct!\n\n" +
"Hint: your color is alphabetically lower than mine.\n\n" +
"Please try again";
var higherMsg = "Sorry, your guess is not correct!\n\n" +
"Hint: your color is alphabetically higher than mine.\n\n" +
"Please try again";

function do_game() {
	var done = false;
	var target_index = Math.floor(Math.random()*colors.length);
	var target = colors[target_index];
	var count = 0;
	while(!finished){
		guess_input = prompt(question);
		var guess_pos = allColors.indexOf(guess_input);
		var target_pos = allColors.indexOf(target);
		if(guess_pos < 0){
			alert(invalidMsg);
			count++;
		}else if(guess_pos < target_pos){
			alert(lowerMsg);
			count++;
		}else if(guess_pos > target_pos){
			alert(higherMsg);
			count++;
		}else{
			count++;
			finished = true;
			var successMsg = "Congratulations! You have guessed the color!\n\n"+
			"It took you "+count+" to finish the game!\n\n"+
			"You can see the colour in the background.";
			alert(successMsg);
			myBody=document.getElementsByTagName("body")[0];
			myBody.style.background=target;
		}
	}
}
function generate() {
	var random_number = Math.floor(Math.random() * (colors.length + 1));
	random_number 
}

