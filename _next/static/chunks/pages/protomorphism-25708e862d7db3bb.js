(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[739],{8432:function(e,t,n){"use strict";n.r(t);var r=n(9292),o=n(5893);t.default=function(){return(0,o.jsxs)(r.By,{children:[(0,o.jsx)(r.Dx,{size:"1",text:"Protomorphism"}),(0,o.jsxs)("p",{children:["The last two posts ventured off into the hypothetical world. In that world, we had a language very much like javascript but with variants and protocols. Unfortunately, that language isn't real, but that doesn't mean we can't sneak some of those ideas into our javascript. Today we are going to explore protocols further using a library called ",(0,o.jsx)("a",{href:"https://github.com/airportyh/protomorphism",children:"Protomorphism"})," that adds protocols into javascript."," "]}),(0,o.jsx)(r.Q_,{children:"\n      import protocol from 'protomorphism'\n\n      const Mapper = protocol({\n        map: (x, f) => {\n         // maps f over x\n        }\n      });\n\n      Mapper.implementation(Array, {\n        map: (arr, f) => arr.map(f)\n      })\n\n      const map = (f, x) => Mapper.map(x, f);\n\n      map(x => x + 2, [1,2,3]) // [3,4,5]\n    "}),(0,o.jsx)("p",{children:"Here we can see protomorphism in action with our Mapper protocol from the last post. This actually isn't too different from the code we would write in our imaginary language. What we see here is basically all of protomorphism, it is a simple library that does one thing. In fact, it is only 31 lines of code. But fewer lines doesn't mean less powerful. As promised in our last post, we are going to create our own lodash like library, but our library, using the power of protocols, will work whether we use normal Javascript Arrays, ImmutableJs Lists, or any type that implements our protocol."}),(0,o.jsx)(r.X6,{size:"2",text:"Sequence Protocol"}),(0,o.jsx)(r.Q_,{children:"\n      const Sequence = protocol({\n        cons: (coll, elem) => {\n          // prepends elem to coll\n        },\n        first: (coll) => {\n          // gets first element of coll\n        },\n        rest: (coll) => {\n          // returns all but first element\n        },\n        isEmpty: (coll) => {\n          // returns true if empty\n        },\n        empty: (coll) => {\n          // given a coll, it will return\n          // an empty collection of the same type\n        }\n      })\n    "}),(0,o.jsx)("p",{children:"Here is our Sequence protocol from which we will build all our lodash like functions. It is a simple protocol, with only five methods, each of which is fairly straightforward. Using these we can start building up more and more useful functions. Let's start off with some very simple ones."}),(0,o.jsx)(r.X6,{size:"2",text:"Examples"}),(0,o.jsx)(r.Q_,{children:"\n      const cons = Sequence.cons\n      const first = Sequence.first\n      const rest = Sequence.rest\n      const isEmpty = Sequence.isEmpty\n      const empty = Sequence.empty\n\n      const second = (coll) => first(rest(coll))\n      const ffirst = (coll) => first(first(coll))\n\n      const last = (coll) => {\n        if (isEmpty(coll)) {\n          return undefined\n        } else (isEmpty(rest(coll))) {\n          return first(coll)\n        } else {\n          return last(rest(coll))\n        }\n      }\n    "}),(0,o.jsxs)("p",{children:["We start off with simple aliases to our Sequence functions we need to use. This is purely for convenience's sake and not necessary. Next we implement two very simple functions, ",(0,o.jsx)(r.Rh,{children:"second"})," and",(0,o.jsx)(r.Rh,{children:" ffirst"}),". Second does what it says, it gives of the second element of a collection; ffirst gives us the first of the first element of the collection. Below should illustrate the difference clearly."]}),(0,o.jsx)(r.Q_,{children:"\n      const coll = [[1], [2], [3]]\n      second(coll) // [2]\n      ffirst(coll) // 1\n    "}),(0,o.jsxs)("p",{children:["The ",(0,o.jsx)(r.Rh,{children:"last"})," function is a little more involved, but if you are familiar with recursion it is very simple. If we are passed an empty collection, there is no last, so we return undefined. If we are passed a collection with only one thing in it, we return that thing. Otherwise, we take one item off the collection and find the last of that collection."]}),(0,o.jsx)("p",{children:"One thing to note is that these functions are perfectly comprehensible and sensible and yet we have not mentioned at all what data structure these functions are for. As far as our code is concerned, it doesn't matter if this is an array, an immutable list, or any other type. All that matters for the functions above is that the data structure implements the Sequence protocol."}),(0,o.jsx)(r.X6,{size:"2",text:"Implementations"}),(0,o.jsx)(r.Q_,{children:"\n      Sequence.implementation(Immutable.List, {\n          cons: (coll, elem) => coll.unshift(elem),\n          empty: (coll) => Immutable.List.of(),\n          first: (coll) => coll.first(),\n          rest: (coll) => coll.rest(),\n          isEmpty: (coll) => coll.isEmpty(),\n      });\n    "}),(0,o.jsx)("p",{children:"Above is our implementation of the sequence protocol for ImmutableJs Lists. Our Sequence protocol assumes that each of our functions has no side effects, so ImmutableJs is a perfect fit here. In fact, there are methods that correspond exactly to the methods on our the Sequence protocol. Now we can use the functions we wrote on ImmutableJs Lists."}),(0,o.jsx)(r.Q_,{children:"\n      const coll = Immutable.fromJS([[1], [2], [3]])\n      second(coll) // List [2]\n      ffirst(coll) // 1\n    "}),(0,o.jsx)("p",{children:"This works exactly the same as the example above. In our first example, we just assumed we had an implementation of Sequence for Javascript Arrays, let's go ahead and write one now."}),(0,o.jsx)(r.Q_,{children:"\n      Seq.implementation(Array, {\n          cons: (coll, elem) => {\n              coll = coll.slice() // copy\n              coll.unshift(elem)\n              return coll\n          },\n          empty: (coll) => [],\n          first: (coll) => coll[0],\n          rest: (coll) => {\n              coll = coll.slice() // copy\n              coll.shift(0)\n              return coll\n          },\n          isEmpty: (coll) => coll.length == 0\n      });\n    "}),(0,o.jsx)("p",{children:"The definition for Arrays is a tad bit uglier. This is due mainly to the fact that our protocol's methods are assumed to be side-effect free, whereas Arrays methods mutate. So in order to do cons and rest, we must copy the array. Now, that we have defined the Sequence protocol for Arrays, all functions that just use protocol methods will work with Arrays."}),(0,o.jsx)(r.X6,{size:"1",text:"More Functions"}),(0,o.jsx)(r.Q_,{children:"\n      const map = (f, coll) => {\n          if (isEmpty(coll)) {\n              return coll;\n          } else {\n              return cons(f(first(coll)), map(f, rest(coll)));\n          }\n      }\n\n      const filter = (pred, coll) => {\n          if (isEmpty(coll)) {\n              return coll;\n          } else if (pred(first(coll))) {\n              return cons(first(coll), filter(pred, rest(coll)));\n          } else {\n              return filter(pred, rest(coll));\n          }\n      }\n\n      const reduce = (f, init, coll) => {\n          if (isEmpty(coll)) {\n              return init;\n          } else {\n              return f(reduce(f, init, rest(coll)), first(coll))\n          }\n      }\n    "}),(0,o.jsx)("p",{children:"Here we have the three powerhouse lodash functions. By showing that we can implement these, it becomes easy to see how we can begin to implement all the functionality that lodash supports, but without depending on a concrete implementation."}),(0,o.jsx)(r.X6,{size:"2",text:"Conclusion"}),(0,o.jsx)("p",{children:"Protocols give us the ability to reason at a higher level of abstractions. They provide us with a way to extend functionality to new code that we never planned for. This level of programming allows our code to be clear, yet powerful. In our next post, we are going to explore a similar, yet slightly different way to provide flexibility and extensibility, multi-methods."})]})}},9292:function(e,t,n){"use strict";n.d(t,{By:function(){return Z},CN:function(){return _},Dx:function(){return Q},Ee:function(){return g},Fz:function(){return k},Mc:function(){return L},Q_:function(){return O},R4:function(){return T},Rh:function(){return z},X6:function(){return P},rU:function(){return x}});var r=n(9499),o=n(5988),i=n.n(o),l=n(9008),s=n(1664),c=n.n(s),a=n(4394),u=n(2041),h=n(8903),f=n(6410),d=n(8603),p=n(5893);function m(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function y(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?m(Object(n),!0).forEach((function(t){(0,r.Z)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):m(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var x=c(),g=function(){return null},w=function(e){(0,f.Z)(e),e.languages.clojure=y(y({},e.languages.clojure),{},{number:/\b-?(0x)?\d*\.?\d+\b/g,logicVariable:/(\?|!)[a-zA-Z][a-zA-Z0-9-]+/})};w.displayName="clojure",w.aliases=[],a.Z.registerLanguage("javascript",u.Z),a.Z.registerLanguage("haskell",h.Z),a.Z.registerLanguage("clojure",w);var j=function(e){var t=e.children,n=e.right,o=e.top,i=e.left;e.buttom;return(0,p.jsx)("div",{style:(0,r.Z)({position:"absolute",right:n,left:i,top:o},"left",i),children:t})},b=function(e){var t=e.children,n=e.top,r=e.left,o=e.right,i=e.bottom;return(0,p.jsx)("div",{style:{paddingTop:n,paddingLeft:r,paddingRight:o,paddingBottom:i},children:t})},v=function(e){return function(e){var t,n,r;return(r=e.split("\n")).length>1&&r.shift(),n=function(e){return/^ */.exec(e)[0].length}((t=r)[0]),t.map((function(e){return e.substring(n,e.length)})).join("\n")}(e)},S=y(y({},d.mQ),{},{operator:{color:"#cb4b16"},logicVariable:{color:"#2aa198"},'pre[class*="language-"]':y(y({},d.mQ['pre[class*="language-"]']),{},{backgroundColor:"#fff"})}),E=function(e){var t=e.source,n=e.language;return(0,p.jsx)(a.Z,{language:n,style:S,children:v(t)})},O=function(e){var t=e.children;return(0,p.jsx)(E,{language:"javascript",source:t})},k=function(e){var t=e.children;return(0,p.jsx)(E,{language:"haskell",source:t})},_=function(e){var t=e.children;return(0,p.jsx)(E,{language:"clojure",source:t})},q=function(){return(0,p.jsx)(i(),{id:"1541984143",children:["body{font-family:helvetica,sans-serif;color:#333;line-height:1.5;}","a{color:#333;}"]})},I=function(e){var t=e.children;return(0,p.jsx)("div",{style:{margin:"0 auto",maxWidth:700},children:t})},A=function(e){var t=e.children;return(0,p.jsx)("p",{style:{fontSize:"1.5em"},children:t})},L=function(e){var t=e.items,n=e.Elem,r=void 0===n?A:n,o=e.title;return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(P,{text:o}),(0,p.jsx)("ul",{children:t.map((function(e){return function(e){var t=e.href,n=e.text,r=e.Elem;return(0,p.jsx)("li",{children:(0,p.jsx)(r,{children:(0,p.jsx)(x,{href:t,children:(0,p.jsx)("a",{children:n})})})},t)}(y(y({},e),{},{Elem:r}))}))})]})},P=function(e){var t,n=e.color,r=e.text,o=e.size;return t={1:"h1",2:"h2",3:"h3",4:"h4"}[void 0===o?1:o],(0,p.jsx)(t,{style:{color:n},children:r})},z=function(e){var t=e.children;return(0,p.jsx)("code",{style:{backgroundColor:"rgba(27,31,35,0.05)",padding:"0.2em 0.4em",borderRadius:3,fontFamily:"Monaco, monospace",fontSize:13,whiteSpace:"nowrap"},children:t})},T=function(e){var t=e.children;return(0,p.jsx)("blockquote",{style:{paddingLeft:20,margin:0,marginLeft:20,borderLeft:"0.25em solid #dfe2e5"},children:t})},Q=function(e){var t=e.text;return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(l.default,{children:(0,p.jsx)("title",{children:t})}),(0,p.jsx)(P,{text:t,size:1})]})},Z=function(e){var t=e.children;return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsxs)(l.default,{children:[(0,p.jsx)("meta",{name:"viewport",content:"width=device-width, initial-scale=1"}),(0,p.jsx)("link",{rel:"icon",href:"data:;base64,iVBORw0KGgo="}),(0,p.jsx)("meta",{name:"author",content:"Jimmy Miller"}),(0,p.jsx)("link",{rel:"alternate",type:"application/rss+xml",title:"jimmyhmiller.github.io",href:"feed.xml"})]}),(0,p.jsx)(q,{}),(0,p.jsxs)(I,{children:[(0,p.jsx)("div",{style:{position:"relative"},children:(0,p.jsx)(j,{right:0,top:0,children:(0,p.jsx)(x,{href:"/",children:(0,p.jsx)("a",{style:{textDecoration:"none"},children:(0,p.jsx)(P,{color:"#999",text:"Jimmy Miller"})})})})}),(0,p.jsx)(b,{top:70,children:t})]})]})}},9689:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/protomorphism",function(){return n(8432)}])}},function(e){e.O(0,[774,621,854,888,179],(function(){return t=9689,e(e.s=t);var t}));var t=e.O();_N_E=t}]);