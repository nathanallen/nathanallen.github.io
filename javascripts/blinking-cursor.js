function blinkingCursor(elem){
  var elem = elem || document.querySelector('#blinking-cursor')
  setInterval(function(){
    elem.style.visibility = 'hidden'
    setTimeout(function(){
      elem.style.visibility = ''
    }, 600)
  }, 1200)
}

$('document').ready(function() {
  blinkingCursor()
});