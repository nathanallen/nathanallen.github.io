---
layout: post
title: "You had me at hello world"
date: 2013-11-01
comments: false
categories:
---

Ruby:

``` ruby
def say_hello(name)
	p "hello #{name}!"
end

say_hello("world")
```

JavaScript:

``` javascript
function sayHello(name){
	console.log("hello " + name)
}

sayHello("world")
```

Unix:

``` bash
sayhi(){echo "hello $1"}

sayhi world
```