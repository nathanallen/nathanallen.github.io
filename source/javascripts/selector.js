$(window).on('keypress', function(e){evaluateKeystroke(e)})

// Game Controller
game = {
	started: false,
	score: 0,
	goal: 0
}

function initializeGame(){
	game.started = true
	tagAllTheChildren()
	rememberTheURL()
	initializePromptArea()
	updateGamePointsURL("Type Any jQuery Selector or HTML tag to play!")
}

function tagAllTheChildren(){
	$('*').each(function(i,selector){
		game.goal += 1
		listenForElementRemoval( $(selector)[0].tagName )
	})
}

function listenForElementRemoval(tag){
	var $elem = $(tag)
	if ($elem.length){
		setTimeout(function(){listenForElementRemoval(tag)},500)
	} else {
		kaput()
	}
}

function kaput(){
	game.score += 1
	if (game.score === game.goal){
		youWin()
	} else {
		updateGamePointsURL()
	}

}


// View Controller
function initializePromptArea(){
	$('#blinking-cursor').wrap('</h2><h2>> <span id="prompt-area"/>')
}

function rememberTheURL(){
	game.URLstartingPoint = window.location.pathname
}

function updateGamePointsURL(msg){
	window.location.hash = msg || "GAME_POINTS: " + game.score + "/" + game.goal
}

function youWin(){
	window.location.hash = "You_Killed_It!"
	setTimeout(function(){window.location.replace(game.URLstartingPoint)},3500)
}

function prependUserInput(keyCode){
	var char = String.fromCharCode(keyCode)
	$('#prompt-area').append(char)
}

function clearUserInput(){
	$('#prompt-area').text('')
}


// User Input Controller
function evaluateSelector(){
	var selector = $('#prompt-area').text()
	clearUserInput()
	$(selector).remove()
}

function evaluateKeystroke(e){
	var keyCode = e.keyCode || e.charCode
	if (keyCode === 13){
		if (game.started){
			evaluateSelector()
		} else {
			initializeGame()
		}
	}
	// if (keyCode === 8 || keyCode === 46){
	// 	console.log("Don't hit backspace!")
	// }
	prependUserInput(keyCode)
}