---
layout: post
title: "The blinking cursor effect"
date: 2013-11-02 15:55
comments: true
categories:
---

Today I had a bit of an adventure trying to create a realistic blinking cursor on my webpage. My first thought was to use jQuery's `.toggle()` method, and after playing around with the timing of the effect I settled on a 600ms interval. The code looked like this:

``` javascript
function recursiveBlinkingCursor(){
  $elem = $('#blinking-cursor')
  $elem.toggle(600, function(){
    recursiveBlinkingCursor($elem)
  })
}
```	

But using `.toggle()` had two unwanted side-effects. One was that `.toggle()` by default uses the 'swing' animation which causes the cursor to expand and contract vertically as it fades in and out. The other was that the effect was effectively adding and removing the element from the page and therefore was bumping into the things around it. In my case the expansion/contraction was causing the line height to increase and decrease, thereby making the entire line bounce up and down. Not the effect I was aiming for.

The reason for this side-effect is that `.toggle()` uses the css property 'display:none'. What I needed was the css property `'visibility:hidden'`. You can think of it like asking someone to hold your place in line. You're not physically there, but someone is holding your spot.

So I went back to the drawing board, pitched out the `.toggle()` method, and decided to do it oldschool.

``` javascript
function recursiveBlinkingCursor(){
  $elem = $('#blinking-cursor')
  $elem.attr('style', 'visibility:hidden').delay(600)
  $elem.attr('style', 'visibility:true').delay(600)
  recursiveBlinkingCursor()
}
```

This led to a lovely stack overflow message:

``` plain
RangeError: Maximum call stack size exceeded
```

In the end I scraped the jQuery `.delay()` and went with javascript's `setTimeout()`. This nested monstrosity is what I settled on:

``` javascript
function recursiveBlinkingCursor(elem){
  $elem = elem || $('#blinking-cursor')
  setTimeout(function(){
    $elem.attr("style", "visibility:hidden"); 
    setTimeout(function(){
      $elem.attr("style", "visibility:true"); 
      recursiveBlinkingCursor($elem)
    }, 600)
  }, 600)
}
```

Using `setTimeout()` in this way allows me to tell the function to wait, hide, reveal, hide, and then make the recursive call to start it all over again. Works like a charm.

EDIT: A few weeks later I discovered that javascript has a `setInterval()` function. This allowed me to ditch the recursive call altogether. For simplicity's sake I also decided to ditch jQuery. The code as it stands today is:

```
function blinkingCursor(elem){
  var elem = elem || document.querySelector('#blinking-cursor')
  setInterval(function(){
    elem.style.visibility = 'hidden'
    setTimeout(function(){
      elem.style.visibility = ''
    }, 600)
  }, 1200)
}

window.onload = function(){
  blinkingCursor()
}
```

You can view it on github [here](https://github.com/nathanallen/blinking-cursor).

As an addendum, when I showed the effect to a friend he wondered if I could have used the html `<blink\>` tag. Almost certain that I had over-engineered the problem I did a little googling and found these gems: "\<blink\> was once reviled as the most obnoxious tag in HTML. Now it's mostly forgotten." "HTML5 classifies it as a non-conforming feature." "No, really, don't use it. It's simply evil."

Blink and you missed it.