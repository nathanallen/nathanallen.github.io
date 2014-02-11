---
layout: post
title: "Traffic Calming in the Kingdom of Javascript"
date: 2014-02-11 00:02
comments: true
categories: 
---
Trouble is brewing in the Kingdom of Javascript. The API has said it is fed up with being inundated by AJAX requests. It has set new limits on requests.

###The Decree
New rules have hastily been put in place. By decree, every Citizen Function wishing to make a call to the neighboring Kingdom of API must now wait for a period of 200 ms.
>  By decree, every Citizen Function wishing to make a call to the neighboring Kingdom of API must first wait for a period of 200 ms.

Prominient, 200ms stop signs have been erected around Javascript by the Office of the Set Timeout. Traffic once again begins to flow.


###Traffic Report
At 1392104264925 three Citizen Functions are observed approaching a stop sign, each spaced 1 ms apart. The first waits 200 ms, the second waits 200 ms, the third waits 200 ms and they all proceeded through.

Immediately following these events, three nearly simultaneous AJAX requests are sent off to the Kingdom of API, the first occurring at 1392104265128.

The national paper, in its usual, self-congratulatory manner, praises  the orderly conduct of the Citizen Functions, their duitful observance of the new law, and the work being done by the Office of the Set Timeout. 

Nevertheless, the Kingdom of API is none too pleased. After 200ms of calm, requests are coming in at their usual, hectic rate. And every passing millisecond increases the likelihood of a blockade.

###The Spirit of the Code
This is what the writers of The Code, in their infinite wisdom, set down:

``` javascript
    citizens.forEach(function(citizen){
      setTimeout(function(){
        $.ajax("http://keepcalm.com/api.json", andMoveAlong)
      },200)
```


And this is what the writers meant:

``` javascript
    citizens.forEach(function(citizen,i){
      setTimeout(function(){
        $.ajax("http://keepcalm.com/api.json", andMoveAlong)
      },i*200)
```