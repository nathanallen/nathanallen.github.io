---
layout: post
title: "A Personal API?"
date: 2013-11-13 10:35
comments: true
categories: 
---
The other day I came across a job posting that challenged applicants to submit their resumes and cover letters through an API. This got me thinking about building my own API, so after googling around to see what other people had done along the same lines ([here](http://readwrite.com/2013/08/23/building-personal-api) and [here](http://x.naveen.com/post/51808692792/a-personal-api)), I set to work building a simple sinatra app that serves up my data. It is now live at [api.codeislike.com/](http://api.codeislike.com), hosted by heroku.

It turns out that Quantified Self junkies are all over the idea of a personal API. Given all the data we're collectively churning out with fitbits and other internet-of-things-style embedded-electronics, the potential for a live feed of personal activity-levels (and feeding-patterns) isn't that far off.

For now, my API is largely static. I didn't use a database or any cacheing. But for kicks I did pull in my twitter activity.

A few things that I learned along the way:

###Regexes & Routes
I thought it would be an interesting challenge to allow the consumer of my API to drill down to the exact data they wanted instead of just returning the entire json object. So, for instance, instead of returning all of my status updates, they could request only my twitter status by going to http://api.codeislike.com/status/twitter. 

To impliment this I used a simple regex with a wildcard that captures the optional second arguement:

``` ruby
get '/:category/?*' do
	category = params[:captures][0].to_sym
	item = params[:captures][1].to_sym unless params[:captures][1].empty?
	item ? json(API_DATA[category][item]) : json(API_DATA[category])
end
```

###Cross-Origin Resource Sharing
It turns out web-browsers don't like it very much if you try to pull data from one domain to another. In my case I was trying to see if I could access my API (hosted on Heroku) from this website (hosted on github).

``` javascript
$.getJSON("http://api.codeislike.com/status/twitter", function(tweet){
	console.log(tweet)
})
```

Chrome's error message spelled out the problem:
```
XMLHttpRequest cannot load http://api.codeislike.com/.
No 'Access-Control-Allow-Origin' header is present on the requested resource. 
Origin 'http://codeislike.com' is therefore not allowed access.
```

One way people are working around this is to use jsonp which wraps the json in html, thereby fooling the browser. Since I had access to the server, the simplest solution was to add the required header to all of my controllers using a wildcard to make it accessible to anyone:

``` ruby
before do
	response.header['Access-Control-Allow-Origin'] = '*'
end
```

###Conclusion
I doubt I'll put any more time into this project, but perhaps we'll eventually see sites like IFTTT take this idea to the next level by providing access to aggregated, personal API data. Better yet, and of far more utility, would be a live feed of health-related data beamed straight to my doctor.

Early Quantified Self guinea pigs like Larry Smarr ([The Measured Man: The Atlantic](http://www.theatlantic.com/magazine/archive/2012/07/the-measured-man/309018/)) and Tim Ferriss ([2012 Wired Health Conference Video Interview](http://fora.tv/2012/10/16/4-Hour_Everything_How_Tim_Ferriss_Tracks_His_Lifes_Data)) are blazing that trail for the rest of us.