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
  setInterval(function(){
    if ($elem.hasClass('exterminate') && !$elem.hasClass('exterminated')){
      $elem.removeClass('exterminate')
      if ($elem.hasClass('game')){
        $elem.css('display', '')
      } else {
        that.kaput($elem)
      }
    }
  },500)
}

Game.prototype.kaput = function($elem){
  this.score += 1
  $elem.addClass('exterminated')
  if (this.score === this.goal){
    this.viewController.youWin()
  } else {
    this.viewController.updateGameStatsInURL(this.score,this.goal)
  }
}

Game.prototype.onKeypress = function(e){
  var keyCode = e.keyCode || e.charCode
  if (keyCode === 13) {
    if (this.active) {
      this.viewController.evaluateSelector()
    } else {
      this.initialize()
    }
  }
  if (this.active) {
    this.viewController.appendUserInput(keyCode)
  }
}

// View Controller
var ViewController = function(){
  this.origin = window.location.pathname
  this.$prompt = $('#prompt')
  this.$inputArea = $('#input-area')
}

ViewController.prototype.initialize = function(){
  this.switchToGameHeader()
  this.updateMessageInURL("Type Any jQuery Selector or HTML tag to play!")
}

ViewController.prototype.switchToGameHeader = function(){
  this.initializePromptArea()
  $('header').first().css({'position':'fixed','z-index':1, 'top':0, 'width':'540px'})
  $('header hgroup h1').css('color','#f2f2f2').text("Selector Destructor")
  $('header #subtitle').text('> Type any HTML tag to play!')
  $('body').css('margin-top','180px')
}

ViewController.prototype.initializePromptArea = function(){
  this.$prompt.wrap('<h2>>').prepend(' ')
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
  $(selector).css('display','none').addClass('exterminate')
}

ViewController.prototype.appendUserInput = function(keyCode){
  var char = String.fromCharCode(keyCode)
  this.$inputArea.append(char)
}

ViewController.prototype.clearUserInput = function(){
  this.$inputArea.text('')
}

// Keypress Handler
var KeypressHandler = function(){}

KeypressHandler.prototype.preventBackspace = function(e){
  var keyCode = e.keyCode || e.charCode
  if (keyCode == 46 || keyCode == 8){
    e.preventDefault()
    backspace()
  }
}

function backspace(){
  var text = $('#input-area').text()
  var replacement = text.substr(0,text.length-1)
  $('#input-area').text(replacement)
}

$(function() {
  var game = new Game()
  var keypressHandler = new KeypressHandler()

  $(window)
    .on('keypress', game.onKeypress.bind(game))
    .on('keydown', keypressHandler.preventBackspace.bind(keypressHandler))
})