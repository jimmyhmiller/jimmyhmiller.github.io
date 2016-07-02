---
layout: post_page
title: Multi-Methods in Javascript
---

### Mult-Methods in Javascript

I recently released a [micro-library on npm](https://github.com/jimmyhmiller/multiple-methods) that implements multi-methods in javascript. Multi-methods aren't a very common feature, but conceptually they are incredibly simple, they add extensibility to functions. In order to understand multi-methods better, let's look at an example and then take a peek at the implementation.

In order to prevent us from coming up with some contrived example that works for multi-methods but would never be encountered in the real world, I'm going to borrow an example from an unrelated project, Redux. Here's the example:

{% highlight javascript %}
function counter(state = 0, action) {
  switch (action.type) {
  case 'INCREMENT':
    return state + 1
  case 'DECREMENT':
    return state - 1
  default:
    return state
  }
}
{% endhighlight %}

The function here is incredibly simple. It is a pure function that takes in some state and an action and returns a new state. It has a default value if it is called with no args. In fact as far as the example is concerned, it is fairly good code. But it isn't very extensible. If a library exposed this function to us and we wanted to add a new action type, we wouldn't be able to do so. That is the domain of multi methods so let's look at what a rewrite using them would look like.

{% highlight javascript %}
let multi = require('multiple-methods');

let counter = multi((state, action) => action ? action.type : undefined)
    .method('INCREMENT', (state, action) => state + 1)
    .method('DECREMENT', (state, action) => state - 1)
    .defaultMethod((state = 0, action) => state);
{% endhighlight %}

This code has the exact same behavior as the switch statement code above. It is a bit terse but much of that is personal choice of using arrow functions. But the most interesting part about this code is its extensibility. Imagine we want to add a new action 'SET'. With the original code, the source would need to be modified to handle this. With multi-methods this new action requires no modification of existing code and only takes one line.

{% highlight javascript %}
counter.method('SET', (state, {value}) => value);
{% endhighlight %}

This is the power of multi-methods. They allow massive extensibility with very little code. But how does it all work? Here is the whole entire code for the library (with some es6 added in for clarity).

{% highlight javascript %}
"use strict";

var hash = require("object-hash");

function multi(fn) {
    var m = new Map();
    var defaultMethod = function(...args) {
        throw new Error("No match found and no default");
    }
    function dispatcher(...args) {
        var value = fn(...args);
        if (value != undefined && m.has(hash.sha1(value))) {
           return m.get(hash.sha1(value))(...args); 
        } else {
            return defaultMethod(...args);
        }
        
    }
    dispatcher.method = (value, f) => {
        m.set(hash.sha1(value), f);
        return dispatcher;
    }
    dispatcher.defaultMethod = (f) => {
        defaultMethod = f;
        return dispatcher;
    } 
    return dispatcher;
}

module.exports = multi
{% endhighlight %}

We don't have enough space to go line by line but the parts are fairly simple. First multi takes a function. This is the function we will use to decide how to dispatch. For example, with our counter our dispatching function picks out the type of the action and dispatches on that. Next we have a map. This is where we store our methods. We hash the value before we store it in our map because if it is an object we need value equality instead of referential equality. All we do when we call the function is first apply our dispatching function to obtain a value to dispatch on. We look up that value in our map and then call the function we get back with the original args we were given.

Multi-methods give us a very flexible way to implement polymorphism. Imagine instead implementing this with a tradition object oriented approach. An implementation of this using classes would not only be more limiting but more verbose. It would open our function up to the problems of pervasive mutability. Maybe instead of classes being added to javascript multi-methods would have been better. They might not be a very well known feature of javascript, but in my view they fit its spirit, flexibility and extensibility above all.
