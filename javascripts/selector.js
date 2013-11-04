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
	initializePromptArea()
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
}


// View Controller
function initializePromptArea(){
	$('#blinking-cursor').wrap('<div>> <span id="prompt-area"/></div>')
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