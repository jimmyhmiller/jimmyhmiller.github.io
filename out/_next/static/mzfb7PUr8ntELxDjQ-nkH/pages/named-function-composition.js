(window.webpackJsonp=window.webpackJsonp||[]).push([["8952"],{KT7v:function(e,t,n){"use strict";n.r(t);var a=n("q1tI"),o=n.n(a),i=n("GyP+");t.default=function(){return o.a.createElement(i.c,null,o.a.createElement(i.i,{text:"Named Function Composition"}),o.a.createElement("p",null,"Some time ago I release a little library on NPM called"," ",o.a.createElement(i.h,null,"fluent-compose"),". I've had some mixed feelings about my creation. I know that no one has, or will use it and if they looked at it would probably dismiss it. In fact, if I hadn't written it, I would do the same. And yet, I think I've stumbled onto a fairly decent idea. By decent idea, I mean a hack. But before we dive into this hack, let's look at the situation that gave rise to it."),o.a.createElement("p",null,"There is this fantastic, little known library called"," ",o.a.createElement("a",{href:"https://zaphod.surge.sh/"},"Zaphod"),". The idea behind Zaphod is to mirror Clojure's immutable data API. This makes it incredibly simple to do immutable updates on plain javascript objects."),o.a.createElement(i.f,null,"\n      import { update, inc } from 'zaphod/compat';\n      const state = { count: 0 };\n      update(state, 'count', inc) // { count : 1}\n    "),o.a.createElement("p",null,"The way I've written the code above is actually not the default way Zaphod works. I imported the ",o.a.createElement(i.h,null,"compat")," part of zaphod. By default, the functions are exposed to take advantage of the function bind operator"," ",o.a.createElement(i.h,null,"::"),"."," "),o.a.createElement(i.f,null,"\n      import { update, inc, dec } from 'zaphod';\n      const state = { count: 0, otherCount: 0 };\n      state::update('count', inc) // { count : 1}\n      \n      state\n          ::update('count', inc)\n          ::update('otherCount', dec)\n      // {count: 1, otherCount: -1}\n    "),o.a.createElement("p",null,"This is actually some really neat functionality. It allows you to chain your operators together. We can build pipelines by continuing to bind. Unfortunately, we don't get function bind syntax for free. Function bind is still a stage 0 proposal. This means there is a very good possibility it will never make it into javascript. In fact, after a few years of sitting at stage 0, it is basically considered dead. There is quite a lot of risk involved in using it and more conservative configurations like"," ",o.a.createElement(i.h,null,"create-react-app")," wouldn't use it."),o.a.createElement("p",null,"But function bind syntax also has flaws even if it were accepted into the language. Function bind syntax abuses ",o.a.createElement(i.h,null,"this")," the most misunderstood keyword in all of javascript. The functions you write with function binding in mind, must use ",o.a.createElement(i.h,null,"this"),", they can't be normal functions. Of course, you can wrap up those functions, but if we need to wrap functions up, why not wrap them in a way that doesn't require function bind?"),o.a.createElement("p",null,"This is where ",o.a.createElement(i.h,null,"fluent-compose")," comes in. Let's look at an example."),o.a.createElement(i.f,null,"\n      import * as zaphod, { update } from 'zaphod/compat';\n      import { threadFirst, fluentCompose } from 'fluent-compose';\n      \n      const transform = fluentCompose(threadFirst(zaphod));\n      \n      const transformer = transform\n          .update('count', inc)\n          .update('otherCount', dec)\n          .set('anotherCounter', 2)\n      \n      transformer({count: 0, otherCount: 0, anotherCounter: 0})\n      // {count: 1, otherCount: -1, anotherCounter: 2}\n      \n      update({ counters: {count: 0, otherCount: 0}}, 'counters', transformer)\n      // {counters: {count: 1, otherCount: -1, anotherCounter: 2}}\n    "),o.a.createElement("p",null,"Here we see the ",o.a.createElement(i.h,null,"threadFirst")," function in use. This allows us to take a collection of functions, in this case ",o.a.createElement(i.h,null,"zaphod"),", and wrap them up into a fluent interface. But what does this fluent interface do? It is just function composition. After calling it, we get a function back. We can now use this function to pass our data through the pipeline. Since, what we get back is just a function, we can also pass this function around. We can see its use on line 14 as just a normal function that lets us perform a series of transformations on data."),o.a.createElement("p",null,"This is a fairly simple use of ",o.a.createElement(i.h,null,"fluent-compose"),", let's take it one step further."),o.a.createElement(i.f,null,"\n      import * as zaphod from 'zaphod/compat';\n      import * as lodashFpCollection from 'lodash/fp/collection';\n      import { threadFirst, threadLast, fluentCompose } from 'fluent-compose';\n      \n      const zaphodTransform = threadFirst(zaphod);\n      const lodashTransform = threadLast(lodashFpCollection);\n      \n      const transform = fluentCompose({\n        ...zaphodTransform,\n        ...lodashTransform,\n      })\n      \n      const transformer = transform\n        .map(x => x + 2)\n        .filter(x => x % 2 === 2)\n        .set(0, 3)\n      \n      transformer([1,2,3,4]) // [3, 6]\n    "),o.a.createElement("p",null,"Here we can see a combination of two totally separate libraries. In fact, I even used ",o.a.createElement(i.h,null,"lodash/fp")," because rather than taking its primary argument first, it takes it last. Yet, we were still able to compose these libraries in a simple, yet flexible way."," "),o.a.createElement("p",null,"Yet, ",o.a.createElement(i.h,null,"fluent-compose")," holds still more power. This time, we will be using some of the lower level features of ",o.a.createElement(i.h,null,"fluent-compose"),", explaining them here would be beyond the scope of this post."),o.a.createElement(i.f,null,"\n      import { fluentCompose } from 'fluent-compose';\n      \n      const baseReducer = (state, action) => state;\n      \n      const initialState = prev => init => (state, action) =>\n        prev(state || init, action);\n      \n      const reduce = prev => (type, f) => (state, action) => {\n        if (action && action.type === type) {\n          return f(state, action)\n        }\n        return prev(state, action)\n      }\n      \n      const INCREMENT = 'INCREMENT';\n      const DECREMENT = 'DECREMENT';\n      \n      const increment = () => ({\n        type: INCREMENT\n      })\n      \n      const decrement = () => ({\n        type: DECREMENT\n      })\n      \n      const reducer = fluentCompose({ initialState, reduce }, baseReducer)\n      const counter = reducer\n        .initialState(0)\n        .reduce(INCREMENT, x => x + 1)\n        .reduce(DECREMENT, x => x - 1)\n      \n      console.log(\n        counter(0, increment())\n      )\n    "),o.a.createElement("p",null,"Using ",o.a.createElement(i.h,null,"fluent-compose")," we've made a fluent reducer for redux! No longer would we need to write switch statements in order to make a reducer. In fact, since ",o.a.createElement(i.h,null,"fluent-compose")," just makes functions, you can use this reducer with combine reducers. But another really cool thing you can do with it is add on the reducer after the fact. One feature to note with this implementation, is that it actually short circuits, as soon as it finds the action that matches the type, it returns, so there is no wasted computation."),o.a.createElement(i.e,{size:"2",text:"Why do I call this a hack?"}),o.a.createElement("p",null,'I really do think this library is really useful, but at the same time, I can\'t help but feel a little weird about this library. In order to make this library work, I have to take advantage of the fact that functions are objects. I am making a function and then assigning methods to it. This definitely a strange thing to do. Now, I do avoid mutating the functions passed into, I "copy" them before I assign properties to them, but it still feels like the wrong means for accomplishing the task of creating a pipeline.'),o.a.createElement("p",null,"In fact, that is the thing that makes this library a hack; it is the wrong means. This library was created out of the limitation javascript imposes on us. How would we accomplish similar things in other languages? Here are just a couple examples."),o.a.createElement(i.b,null,"\n      ;; Clojure\n      (->> (range 100)\n           (map (partial + 2))\n           (filter even?))\n    "),o.a.createElement(i.d,null,"\n      -- Haskell\n      (|>) :: a -> (a -> b) -> b\n      (|>) a f = f a\n      \n      range 100\n      |> map (+2)\n      |> filter even\n    "),o.a.createElement("p",null,"Above we see how we could accomplish similar things in Haskell and Clojure. Almost all functional programming languages have a way to do this. In fact, there are some much more powerful techniques for function composition in both Haskell and Clojure."),o.a.createElement(i.e,{size:"3",text:"Still interesting"}),o.a.createElement("p",null,'At the same time, this method has some interesting features all on its own. What we have done is allow our functions to have special ways in which they compose. Each function can determine for itself special composition points. At each point along the way, we keep these composition properties, allowing us to compose further. Each of these composition methods have a name, hence "named function composition". While born out of necessity an implemented as a hack, I there is something here, something interesting that might be worth exploring further. (Addendum: It has been two years and I\'ve yet to explore it further.)'))}},VPif:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/named-function-composition",function(){var e=n("KT7v");return{page:e.default||e}}])}},[["VPif","5d41","9da1"]]]);