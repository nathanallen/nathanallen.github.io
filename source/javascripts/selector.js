$(window).on('keypress', function(e){
	var inputController = new InputController();
	inputController.evaluateKeystroke(e)
})

the_game_has_started = false

function startTheGame(){
	the_game_has_started = true
	var game = new Game()
	game.initialize()	
}


// Game Controller
var Game = function(){
	this.score = 0
	this.goal = 0
	this.viewController = new ViewController()
}

Game.prototype.initialize = function(){
	this.tagAllTheChildren()
	this.viewController.initialize()
}

Game.prototype.tagAllTheChildren = function(){
	var that = this
	$('*').each(function(i,selector){
		that.goal += 1
		that.listenForElementRemoval( $(selector)[0].tagName )
	})
}

Game.prototype.listenForElementRemoval = function(tag){
	var that = this
	var $elem = $(tag)
	if ($elem.length){
		setTimeout(function(){that.listenForElementRemoval(tag)},500)
	} else {
		this.kaput()
	}
}

Game.prototype.kaput = function(){
	this.score += 1
	if (this.score === this.goal){
		this.viewController.youWin()
	} else {
		this.viewController.updateGameStatsInURL(this.score,this.goal)
	}
}

// View Controller
var ViewController = function(){
	this.origin = window.location.pathname
	this.$promptArea = $('#blinking-cursor')
}

ViewController.prototype.initialize = function(){
	this.initializePromptArea()
	this.updateMessageInURL("Type Any jQuery Selector or HTML tag to play!")
}

ViewController.prototype.initializePromptArea = function(){
	this.$promptArea.wrap('</h2><h2>> <span id="prompt-area"/>')
}

ViewController.prototype.updateGameStatsInURL = function(score,goal){
	this.updateMessageInURL("GAME_POINTS: " + score + "/" + goal)
}

ViewController.prototype.updateMessageInURL = function(msg){
	window.location.hash = msg
}

ViewController.prototype.youWin = function(){
	var that = this
	this.updateMessageInURL("You_Killed_It!")
	setTimeout(function(){that.returnToOrigin()},3500)
}

ViewController.prototype.returnToOrigin = function(){
	window.location.replace(this.origin)
}


// User Input Controller
var InputController = function(){
	this.$prompt = $('#prompt-area')
}

InputController.prototype.evaluateKeystroke = function(e){
	var keyCode = e.keyCode || e.charCode
	if (keyCode === 13){
		if (the_game_has_started){
			this.evaluateSelector()
		} else {
			startTheGame()
		}
	}
	this.appendUserInput(keyCode)
}

InputController.prototype.evaluateSelector = function(){
	var selector = this.$prompt.text()
	this.clearUserInput()
	$(selector).remove()
}

InputController.prototype.appendUserInput = function(keyCode){
	var char = String.fromCharCode(keyCode)
	this.$prompt.append(char)
}

InputController.prototype.clearUserInput = function(){
	this.$prompt.text('')
}