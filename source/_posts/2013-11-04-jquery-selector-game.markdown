---
layout: post
title: "jQuery Selector: The Game"
date: 2013-11-04 22:15
comments: true
categories: 
---
I invite you to vandalize my site. **Hit enter to play**.

Ever since learning about *jQuery Selectors* I've thought it would be pretty cool to make a game out of it. So yesterday I gave it a shot and came up with a functional MVP. No, really: scroll up, and hit enter to play. Instructions will appear in the address bar. (HINT: 'strong', 'em', 'p', '*'.)

The first challenge I faced in coding this was determining if I could detect the removal of an element from the page. Sure enough, after a little bit of playing around in the console I had a working event listener. 

	function listenIExist(elem){
		var $elem = $(elem)
		if ($elem.length){
			setTimeout(function(){listenIExist(elem)},600)
		}
		else {
			console.log('Vamooosh!')
		}
	}

Each time the element's selector is passed into the function it uses its length to determine if it still exists on the page.

The next question was how I was going to collect all the tags in the first place. My initial thought was I'd select the document as a whole and then iterate through all the children, and the children's children, and the children's children's children. Easy with a recursive loop. But not very pretty. It looked something like this, and worked terribly:

	function howMuchFortheChildren(tag){
		var child = tag
		tagsArray.push($(child)[0].tagName)
		var $children = $(child).children()
		if ($children.length){
			$children.each(function(){
				howMuchFortheChildren(this)
			})
		}
	}

But then I discovered a novel solution that simplified things considerably. jQuery supports a wildcard selector. Why not use that?

	function tagAllTheChildren(){
		$('*').each(function(i,selector){
			listenIExist( $(selector)[0].tagName )
		})
	}

Now we were talking. The core pieces were in place. Except, how was I going to get user input?

I'd made the blinking-cursor in the header only a few days prior. It seemed almost too perfect. Forget about text fields. *Here* was an interesting challenge.

Using jquery's .wrap() and .append() methods I was able to manipulate the html around the cursor. But I also needed the cursor to move down to a new line. Since it was already wrapped in the \<h2> tag what I needed to do was break it into its own heading.
    <h2>> begin braindump<span id="blinking-cursor">|</span></h2>
So I used a trusty injection attack. I prepended a closing and opening \<h2> tag to the cursor. Now, instead of having one line I had two:
    <h2>> begin braindump</h2>
    <h2>> <span id="blinking-cursor">|</span></h2>

From there, the cursor's movement is just a side-effect of it being bumped over by the text to the left of it. After the user hits enter the 'field' is cleared and the process starts over again. However this is where I hit a major bug: the backspace.

Hitting backspace triggers the browser to go back to the previous page in its  history. Everyone has at some infuriating moment done it. At the moment I've only accidentely managed to sidestep the problem.

The address bar, as understated as it is, is the only safe place I could think of to display game stats. As a side-effect of updating the hash, the browser thinks you've  gone to a new page. So if you bump into the backspace, you may just go back to an earlier score without the page reloading.