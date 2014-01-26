---
layout: post
title: "Hash Smells"
date: 2014-01-26 12:04
comments: true
categories: 
---
Lately I've been working a lot with hashes, specifically nested hashes, and I've found myself doing this (smelly) pattern:

``` ruby
if word_freqs[current_word]
  if word_freqs[current_word][next_word]
    word_freqs[current_word][next_word] += 1
  else
    word_freqs[current_word][next_word] = 1
  end
else
  word_freqs[current_word] = {next_word => 1}
end
```
There must be a better way...

##Seeing Double
Part of the smell comes from all the duplication. Can we tighten things up by using a variable? The answer is yes and no.

The main problem with using a variable is that any change we make to the variable wont be reflected in the hash. In other words, the variable and the hash do not point to the same object.

This does not work!
``` ruby
root_word = word_freqs[current_word]
if root_word
  if root_word[next_word]
    root_word[next_word] += 1
  else
    root_word[next_word] = 1
  end
else
  root_word = {next_word => 1}
end
```
Changes made to `root_word` are *not* reflected in the `word_freqs` hash! **They do not point to the same object!**

And before you take it a step further, you definitely should not try to access the value of the nested hash directly:

``` ruby
nested_value = word_freqs[current_word][next_word]
```
If you do this, you're likely to throw `undefined method '[]' for nil:NilClass`. Although the first level of the nested hash may exist, there's no saying the second level will exist.
``` ruby
word_freqs[current_word]
# returns the value or nil
word_freqs[current_word][next_word]
# returns the value or nil or throws error: undefined method '[]' for nil:NilClass

```

##Ampersand, Ampersand
A nice way to clean up this mess is to create a conditional check using `&&`. Since both sides of the arguement must return true for the conditional to return true, it will exit as soon as it gets a falsy value. In other words, if the first level of the hash exists, and if the nested level exists... we've got ourselves a nested conditional check!

``` ruby
root_word = word_freqs[current_word]
if root_word && root_word[next_word]
  word_freqs[current_word][next_word] += 1
else
  word_freqs[current_word] = {next_word => 1}
end
```
As good as it gets, and much less smelly!

##Playing with Default
The nice thing about changing the default behavior of Hash is that it allows us to eliminate the need to set the initial value of the hash. For instance, for my [n-gram counter](https://github.com/nathanallen/wordplay/blob/master/n_gram_counter.rb), I was able to clean up my code by using a hash with a default value of zero.

``` ruby
ngram_freqs = Hash.new(0)

words_array.each_index do |i|
  unless i >= stop_index
    ngram = words_array[i..i+offset].join(' ')
    ngram_freqs[ngram] += 1 # no need to set the intiial value!
  end
end
```
The only drawback is that the hash no longer returns nil if an item doesn't exist, but in this case, I don't need that behavior. Knowing that a word has a frequency of zero is fine by me! And there's zero risk of adding together nil and 1. There's just zero.

## Willy Nilly
As a sidenote, I discovered you can (kind of) have your cake and eat it too. You can set the default value AND have it return nil by passing Hash a block:

``` ruby
my_hash = Hash.new{|h,k| h[k] = 0; nil}
```
This has the odd effect of 'setting' a key to the default value of zero when you try to 'get' that key. The first time you access it you'll get nil. But look it up a second time, and you'll get 0. In other words, if the item didn't exist before, woops, now you've added it!

Do we really want a "getter" method to act as a "setter"?

I think not. Best to follow the law of Least Surprise. Let defaults be defaults! (And try not to smell, will you?).