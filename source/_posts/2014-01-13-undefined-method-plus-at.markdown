---
layout: post
title: "Undefined method +@"
date: 2014-01-13 22:50
comments: true
categories: 
---
It's tricky keeping program interfaces straight. I recently had an interesting experience switching from javascript to ruby. The trouble started when I tried to use the increment operator: `++`.

The errors were baffling. Try as I would to debug, I couldn't identify the source of the problem.

``` ruby
# undefined method \`+@' for false:FalseClass (NoMethodError)  
# undefined method \`+@' for true:TrueClass (NoMethodError)  
# undefined method \`+@' for nil:NilClass (NoMethodError)  
# undefined method \`+@' for "":String (NoMethodError)
```

 But as I poked around, one thing was clear. I needed to figure out what was going wrong with the Numeric method `+@`!



## Too Much of a Good Thing
The trouble is that ruby doesn't have any trouble chaining together as many plus-operators as you want. `2+2` and `2++2` and `2+++2` are all going to have a return value of 4.

Javascript on the other hand would throw various syntax errors:

``` javascript
2++2 // SyntaxError: Unexpected number

2+++2 // ReferenceError: Invalid left-hand side expression in postfix operation

2++++2 // SyntaxError: Unexpected token ++
```

What makes this tricky to debug is that ruby will keep on evaluating across line breaks. But of course!

## Sugar Free

The `+` method is just syntactic sugar for `.+`. This means that `1+1` is just a friendly way of writing `1.+(1)`. Leave a plus operator dangling, and it's just going to go ahead and try adding together the left side of the expression with the following line.

So if somewhere in your code you have:


``` ruby
i++
if confused
  be_more_so = 10
end
```

Ruby will try to add the return value of the conditional to `i`. (In other words, `i+10`).

But if, say, your conditional has a return value of nil or true or false or it's a string, or any other whatsit that can't be coerced into an integer, you're going to throw "undefined method +@" FOR ALL OF THE THINGS.[^1]

Solution: Use the ruby plus-equals operator: `+=`, and forget all your javascript.

[^1]: If you use `++` before an if-else conditional you may get `syntax error, unexpected keyword_else`.