---
layout: post
title: "Preventing Backspace"
date: 2013-12-18 18:47
comments: true
categories: 
---

You've just created your first game using javascript, perhaps a TypeRacer clone, and you've run into an annoying bug. Whenever you bump backspace the browser navigates back to the previous page, ending gameplay. It's cramping your style.

By now you already understand how to capture keystrokes, using something along the lines of:

``` javascript
window.onkeypress = function(e){console.log(e.which)}
// or if you prefer jQuery:
$(window).on('keypress', function(e){console.log(e.which)})
```

For reference: `e.which`, `e.keyCode` and `e.charCode` all work just as well.

But something weird is happening, not all the keys are being logged. When you hit arrow keys, or other control keys (Shift, Command, Tab, Escape, etc) you get nothing. 

Even worse, when you hit the backspace button... you go back! How are you supposed to capture the keycode of the backspace button if the browser navigates back!?

##Keypress vs Keydown vs Keyup

It turns out the keypress event is one of three ways to log keystrokes, the other two are keydown and keyup. What's the difference?

Well, let's see for ourselves! Let's setup three event listeners and when the event is triggered we'll print out the timestamp to try to gauge the order in which they're firing.

``` javascript
$(window) //this handy syntax is called a 'cascade'
  .on('keypress', function(e){console.log(e.timeStamp + " keypress!")})
  .on('keyup', function(e){console.log(e.timeStamp + " up!")})
  .on('keydown', function(e){console.log(e.timeStamp + " down!")})

```

Now when we hit a 'control button' like the spacebar we get output in this order:

```
1387421080919 down!
1387421080920 keypress!
1387421080998 up!
```

Keydown is the winner! The keydown event fires just a split second before keypress! No wonder we've been missing it!

##No looking back

Now that we know the order in which the events occur, how do we prevent the default behavior of the back button? Why, `preventDefault()` of course! But we have to make sure to bind our function to the earliest keyboard event: keydown. To do this we just add a line:

``` javascript
$(window).on('keydown', function(event){
  event.preventDefault()
  console.log("halt!")
})
```

Mission Accomplished! We've halted the back button!

But wait a minute, our quick little hack works a little too well... it also prevent a lot of useful keyboard shortcuts from working too. What if I try to refresh the page using Cmd-R?

To single out the backspace we'll need to use some conditional logic in combination with `preventDefault()`. Something along the lines of:

``` javascript
function preventBackspace(e){
  var keyCode = e.keyCode || e.charCode
  if (keyCode == 46 || keyCode == 8){
    e.preventDefault()
    //now do something cool instead
  }
}

$(window).on('keydown', function(e){preventBackspace(e)})

```

So that's how to stop the back button from taking you back. I can only imagine google's SEO algorhithm frowns on the practice so I would use it sparingly. It certainly has its malicious uses!
