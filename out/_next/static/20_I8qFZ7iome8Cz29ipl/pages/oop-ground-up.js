(window.webpackJsonp=window.webpackJsonp||[]).push([[26],{XaiC:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/oop-ground-up",function(){var e=n("g3oc");return{page:e.default||e}}])},g3oc:function(e,t,n){"use strict";n.r(t);var o=n("q1tI"),a=n.n(o),r=n("GyP+"),s=a.a.createElement;t.default=function(){return s(r.c,null,s(r.i,{text:"OOP from the ground up"}),s("p",null,"Any concept when taken for granted can lead to misunderstanding. Concepts we don't understand appear magical, making them either scary or compelling. In fact, typically the difference in attitude towards these magical objects is that of our peers. Despite the popular view that programming is an ever changing field, new ideas in the programming world must fight a hard fought battle. Often things which aren't familiar to the programmer who encounters them are met with suspicion or disdain. But not so with objects, or at least not anymore. Objects have captured the popular mindshare of developers. Objects are the bread and butter of programming, to the point where people are often confused at how languages with no objects can exist at all. We are going to peel back those covers and implement our own objects from the ground up."),s(r.e,{size:"2",text:"The Simplest Object"}),s("p",null,'In order to begin, we must have a target in mind for our first object. A "hello world" of objects, from there we will move to more advanced features implementing them ourselves along the way.'),s(r.f,null,'\n      const person = {\n        firstName: "Alonzo",\n        lastName: "Church"\n      }\n      \n      person.firstName // Alonzo\n      person.lastName // Church\n    '),s("p",null,'This is our target, so in order to implement it we must understand it. The object above has two properties, firstName and lastName and it has some way to access those properties (the . operator). Now, our "object", because it isn\'t built into the language, is certainly not going to have as nice of a syntax as the one above, but we can definitely emulate the behavior of the object above.'),s(r.f,null,"\n      function person(property) {\n        if (property === 'firstName') {\n          return 'Alonzo';\n        } else if (property === 'lastName') {\n          return 'Church';\n        }\n      }\n      \n      person('firstName') // Alonzo\n      person('lastName') // Church\n    "),s("p",null,'So here it is, our first "object". It might be hard to see exactly how our function here is an object, but with a little squinting we can see that it fulfills the exact same role as an object. The normal object has two properties which we can access, so does our "object". The only difference between them is the method of access. Our normal objects have their properties accessed through the dot operator, while our "objects" are through function application. In fact, a simple shift in language can show just how similar our "object" is to real objects.'," "),s(r.e,{size:"3",text:"Terminological"}),s("p",null,'SmallTalk is one the first OO languages; almost all of what is thought about as OO stems from it. Unfortunately we have lost a bit of SmallTalks terminology, terminology which would make things more clear. In the languages we are used to there are two ways to do things with objects, accessing properties (or fields) and invoking methods. With SmallTalk, there was just a single abstraction, message passing (This is called the "uniform access principle" and is the reason people often cite for Java getters/setters.) This "limitation" does not make SmallTalk any less capable. Everything you can do with objects in a modern language can be done in SmallTalk. Once we think about the dot operator as simple sending a message to our object, is our function application any different? We are simple sending the message as a string and our object is replying.'),s(r.e,{size:"2",text:"More Advanced Objects"}),s("p",null,"Our first object (I hope you can see that I am justified in remove those quotes) was fairly limited. In order to make a new person with a different name, we would have to go write a whole new function. But our original javascript object had the same problem, while simpler in syntax, we still how to write out the whole thing. Let's fix that."),s(r.f,null,"\n      function createPerson(firstName, lastName) {\n        return {\n          firstName: firstName,\n          lastName: lastName\n        }\n      }\n      \n      const person = createPerson('Alonzo', 'Church');\n      person.firstName // Alonzo\n      person.lastName // Church\n    "),s("p",null,"Simple enough change, we just made a function that takes some parameters and returns our object. In fact, we can do the same for our object."),s(r.f,null,"\n      function createPerson(firstName, lastName) {\n        return function(property) {\n          if (property === 'firstName') {\n            return firstName;\n          } else if (property === 'lastName') {\n            return lastName;\n          }\n        }\n      }\n      \n      const person = createPerson('Alonzo', 'Church');\n      person('firstName') // Alonzo\n      person('lastName') // Church\n    "),s("p",null,'Since our object is just a function, we create a function that returns a function. Even with this "factory" function, our object continues to work just as it did before. But some of you may think, that\'s not a "real" object, "real" objects have methods. So let\'s add a method.'),s(r.e,{size:"3",text:"Methods"}),s(r.f,null,"\n      function createPerson(firstName, lastName) {\n        return {\n          firstName: firstName,\n          lastName: lastName,\n          fullName: function() {\n              return firstName + \" \" + lastName;\n          }\n        }\n      const person = createPerson('Alonzo', 'Church');\n      person.fullName(); // Alonzo Church\n    "),s("p",null,"Alright, there we are, an object with a method, this won't be too hard to recreate using our function technique."),s(r.f,null,"\n      function createPerson(firstName, lastName) {\n        return function(property) {\n          if (property === 'firstName') {\n            return firstName;\n          } else if (property === 'lastName') {\n            return lastName;\n          } else if (property === 'fullName') {\n            return function() {\n              return firstName + \" \" + lastName;\n            }\n          }\n        }\n      }\n      \n      const person = createPerson('Alonzo', 'Church');\n      person('fullName')(); // Alonzo Church\n    "),s("p",null,'That was simple enough. A method is really just a function. So all we need to do is have our object return a function when you access a property. Then you can call that function. Again though, some people might be saying, this isn\'t a "real" object, "real" objects encapsulate state.'," "),s(r.e,{size:"3",text:"State"}),s(r.f,null,"\n      function makeCounter() {\n        return {\n          value: 0,\n          increment: function() {\n            this.value += 1;\n            return this.value;\n          }\n        }\n      }\n      \n      const counter1 = makeCounter();\n      const counter2 = makeCounter();\n      \n      counter1.increment() // 1\n      counter1.increment() // 2\n      \n      counter2.increment() // 1\n      counter1.increment() // 3\n    "),s("p",null,"Here we have an objects which encapsulates a bit of state. Each counter here keeps its own value. We can call increment on one counter, without affecting the other. This might seem a bit tricky to implement using our function-style objects, but it actually is no more complicated than any others."),s(r.f,null,"\n      function makeCounter() {\n        const value = 0;\n        return function(property) {\n          if (property === 'increment') {\n            return function() {\n              value += 1;\n              return value;\n            }\n          }\n        }\n      }\n      \n      const counter1 = makeCounter();\n      const counter2 = makeCounter();\n      \n      counter1('increment')() // 1\n      counter1('increment')() // 2\n      \n      counter2('increment')() // 1\n      counter1('increment')()// 3\n    "),s("p",null,"Our object with encapsulated state makes use of closures to hold state. In fact, in this version our state is actually further encapsulated because our value isn't publicly accessible. The only way anyone can get at the value is by sending the message 'increment'."),s(r.e,{size:"3",text:"More to come"}),s("p",null,"This is of course a lot more to object oriented programming than what has been shown here. Most notably missing from the discussion is inheritance. Unfortunately addressing inheritance is a bit outside the scope of this article. Perhaps we will revisit it at some point in the future. But even with that feature left out, I hope some of the magic has been removed from objects. Objects aren't special. We don't need magic to make them, we just need simple functions."))}}},[["XaiC",1,0]]]);