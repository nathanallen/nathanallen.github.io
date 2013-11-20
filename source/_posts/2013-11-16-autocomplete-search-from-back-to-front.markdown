---
layout: post
title: "Autocomplete Search"
date: 2013-11-16 14:52
comments: true
categories: 
---
Recently I was on a team that created an airbnb-inspired [parking app](http://eyepark.herokuapp.com). For our MVP, we chose to limit the scope of our project to San Francisco, and I volunteered to create the seed data. Looking back I should have simply made a list of a hundred or so real addresses and called it a day.

Instead I set to work gathering data on the city: I scraped a wikipedia article for [Historical Street Names](http://en.wikipedia.org/wiki/Etymologies_of_place_names_in_San_Francisco), and for kicks I scraped a document that cross referenced zipcodes and neighborhood names and created a lookup table that later became part of our database.

Around the same time we started playing with the Google Maps API and I realized that I could feed the API radomly generated street addresses and get back *real* geographical coordinates and zipcodes. We now had a way to turn fake data into pins on a map.

``` ruby
"94102" => ["Hayes Valley", "Tenderloin", "North of Market"],
"94103" => ["SoMa"],
"94104" => ["Financial District"],
"94105" => ["Embarcadero", "SoMa"],
"94107" => ["Potrero Hill"],
"94108" => ["Chinatown"],
"94109" => ["Nob Hill", "Russian Hill"],
"94110" => ["Mission", "Bernal Heights"],
"94111" => ["Embarcadero", "Barbary Coast"],
"94112" => ["Ingelside-Excelsior"],
"94114" => ["Castro", "Noe Valley"],
"94115" => ["Pacific Heights", "Western Addition", "Japantown"],
"94116" => ["Outer Sunset"],
"94117" => ["Haight Ashbury", "Cole Valley"],
"94118" => ["Inner Richmond"],
"94121" => ["Outer Richmond"],
"94122" => ["Inner Sunset"],
"94123" => ["Marina", "Cow Hollow"],
"94124" => ["Bayview"],
"94127" => ["St. Francis Wood", "West Portal"],
"94129" => ["Presidio"],
"94131" => ["Twin Peaks", "Glen Park"],
"94132" => ["Lake Merced"],
"94133" => ["North Beach", "Fisherman's Wharf"],
"94134" => ["Visitacion Valley"]
```

But as I looked at all the data I had collected, I realized that the zipcode/neighborhood lookup table was key to making our search more robust.

###Handling Search Queries
Incoming search request can be in any number of forms: neighborhood names, street addresses, zipcodes. Since our goal was for a user to be able to find and reserve parking spaces, I needed a way to (naively) parse incoming searches and redirect them. My solution was to create a search controller with a series of conditional regex filters:

``` ruby
def parse_search(user_input)
  if user_input =~ /(?:^|\s)(\d{5}|\d{5}-\d{4})(?:\s|$)/
    find_by_zip(user_input[/\d{5}/])
  elsif user_input =~ /^([a-zA-Z]+\s?)+/
    find_by_hood(user_input)
  elsif user_input =~ /\d+\w?\s\D*/
    find_by_address(user_input)
  else
    last_five_newest_available_spots
  end
end
```

If the search string contained a 5 or 9 digit zipcode, I needed to extract it and  query the database. If instead it looked like a neighborhood name, I needed to first reference the lookup table to see if I could find the zipcode. Finally, if it looked like a street address, I'd let the Google Maps API sort out the zipcode for me. If all else failed, I returned the five most recent parking spots.

The trickiest part of implimenting this was writing a regex that could find a zipcode at *any* point within a string. To do this I used the 'lookahead' and 'lookbehind' feature. For the lookahead I needed to check for either the beginning of the line, or a whitespace character: (?:^|\s). Similarly, The lookbehind checked for the end of the line, or a whitespace: (?:\s|$). In between I checked for either exactly 5 digits, or exactly 5 digits a dash and 4 digits. In this way I avoided getting a false positive "partial match" on longer sequences of numbers.

###DIY Autocomplete
Now that we had seed data and a search controller, the question turned to how we could make that data accessible to users. Although we could list neighborhoods and zipcodes, it would make for a terrible user experience. Instead I thought we could use the data I'd collected to impliment 'instant search.'

I prototyped it for my team, using jQuery and ajax. First, I setup a function to log keystrokes:
``` javascript
function logKeystrokes(){
  $("#search-field").keyup(function(){
    var query = $("#search-field").val()
    if (query.length > 2){
      autocomplete(query)
    }
  })
}
```

Then I added a function that fires off the ajax call and handles the response:

``` javascript
function autocomplete(query){
  $.get("search/autocomplete", { q: query } )
  .done(function(data){
    displayAutocompleteGuessInDOM(data)
  })
}
```

On the backend, the autocomplete search controller checks the database for partial matches, and returns a json object:

``` ruby
def autocomplete
  query = params[:q].downcase
  suggestions = CityData.where('neighborhood LIKE ?', "%#{query}%").select(:neighborhood)
  suggestions.map!{|obj| obj.neighborhood.titleize}
  render json: suggestions.to_json
end
```

From there it's simply a matter of displaying the results on the page.

With that, I had a functioning prototype to show to my team, and we were in unanimous agreement that this was the unifying feature that our app needed. So instead of reinventing the wheel, I rolled up my sleeves, dumped my original code, and dove into jQuery UI's Autocomplete library.

###jQuery Autocomplete
jQuery's implimentation of autocomplete has some nice features. In addition to being able to set minimum length, by default it also takes into account typing rate. But what I really couldn't beat was their implimentation of the drop-down search menu.

Setting up jQuery autocomplete was fairly easy once I wrapped my head around their interface:  
- **source**: where to find the data to populate the search menu.  
- **select**: what to do when the user makes their final selection.  
- **request**: the query being typed.  
- **response**: the data used to populate the seach menu.

I ended up refactoring the code into my search controller along these lines:

``` javascript
setupAutocomplete: function() {
  $("#search-field").autocomplete({
    source: SearchController.onUserKeystroke,
    minLength: 2,
    select: SearchController.onUserSelection
  });
},

onUserKeystroke: function(request, response){
  $.ajax({
    url: "search/autocomplete",
    data: {q: request.term}
  }).done(function(data){
    response(data)
  });
},

onUserSelection: function(e, ui, searchterm){
  e.preventDefault();
  $.ajax({
    url:"search/parking-spots",
    data: {q: searchterm}
  }).done(function(listings){
    SearchController.buildAndAssociateMarkersAndList(searchterm, listings)
  });
}
```

And with that we had a really nice way for our users to find what they were looking for: by street address, neighborhood name, or zip code.

###Lessons learned
Users can interact with autocomplete menus in unexpected ways:  
- They may select an item and hit enter, but don't foget they can click too.  
- If I type really fast, I may not bother to make a selection from the drop down menu, so don't forget to close the menu when I hit submit!  
- Autocomplete can catch some errors (like spelling), but make sure you have a way to handle them on the backend as well.  
- Don't leave your user empty handed: if the search returns nothing, at least have a way of indicating that there are no results.  

Finally, the biggest takeaway was understanding the power of data. To quote Rob Pike: 
> "Data dominates. If you've chosen the right data structures and organized things well, the algorithms will almost always be self-evient. Data structures, not algorithms, are central to programming."