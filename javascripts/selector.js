// Game Controller
var Game = function() {
  this.active = false
  this.score = 0
  this.goal = 0
  this.viewController = new ViewController()
  this.viewController = new ViewController()
}

Game.prototype.initialize = function(){
  this.active = true
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

Game.prototype.onKeypress = function(e) {
  var keyCode = e.keyCode || e.charCode
  if (keyCode === 13) {
    if (this.active) {
      this.viewController.evaluateSelector()
    } else {
      this.initialize()
    }
  }
  this.viewController.appendUserInput(keyCode)  
}

// View Controller
var ViewController = function(){
  this.origin = window.location.pathname
  this.$prompt = $('#prompt')
  this.$inputArea = $('#input-area')
}

ViewController.prototype.initialize = function(){
  this.initializePromptArea()
  this.updateMessageInURL("Type Any jQuery Selector or HTML tag to play!")
}

ViewController.prototype.initializePromptArea = function(){
  this.$prompt.wrap('</h2><h2>> ')
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

ViewController.prototype.evaluateSelector = function(){
  var selector = this.$inputArea.text()
  this.clearUserInput()
  $(selector).remove()
}

ViewController.prototype.appendUserInput = function(keyCode){
  var char = String.fromCharCode(keyCode)
  this.$inputArea.append(char)
}

ViewController.prototype.clearUserInput = function(){
  this.$inputArea.text('')
}



$(function() {
  var game = new Game()

  $(window).on('keypress', game.onKeypress.bind(game))
})
