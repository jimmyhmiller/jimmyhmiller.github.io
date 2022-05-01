(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[592],{934:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/aesthetic-elements",function(){return n(2525)}])},2525:function(e,t,n){"use strict";n.r(t);var r=n(5893),i=n(1438);t.default=function(){return(0,r.jsxs)(i.By,{children:[(0,r.jsx)(i.Dx,{text:"Towards Aesthetics Elements of Programming"}),(0,r.jsx)("p",{children:"Programming styles are immediately recognizable. And yet, the elements that contribute to these styles remain unnamed. What is it that separates the classic Scheme style of programming from a modern OO java style of programming? It is not the language. It is possible to write scheme, javascript, or whatever in the style of a modern OO java program. Nor is it just the paradigm, it isn\u2019t as if all OO programs have the same style. So what precisely are we picking up on when we note the style of a codebase?"}),(0,r.jsx)(i.X6,{size:"2",text:"Identifying Elements"}),(0,r.jsx)("p",{children:"Ideally, to understand these styles, we can consider elements that combine to form a certain style. If we identify the right elements, we should be able to take them, vary them, and combine them to get a particular, recognizable style. Perhaps even, we can see what combinations of these elements are rare, or unseen in the programming world."}),(0,r.jsx)("p",{children:"This is what I hope to explore in the essay. I doubt I will get the elements right from the beginning. But perhaps by throwing some out there we can start to think more clearly about what the elements really are. We can find better ways to divide things and start having an understanding of style."}),(0,r.jsx)(i.X6,{size:"2",text:"Verbose vs Terse"}),(0,r.jsxs)("p",{children:["We can significantly alter the way we communicate in code by varying our verbosity. This might be at the level of a whole program or in a particular section of code. We might adopt patterns that require a certain level of verbosity (objective C named methods, early redux culture) or adopt whole languages that focus on terseness (j/k/apl).",(0,r.jsx)("br",{})]}),(0,r.jsx)("p",{children:"Verbose code can help with clarity. Long, expressive function names can help communicate the semantic meaning of the code underneath. Repetitive elements in code can help reinforce patterns, making it clear what code belongs where. Verbose code can guard against errors, preventing simple transpositions from happening by requiring fully specifying the context of a value."}),(0,r.jsx)("p",{children:"Terseness can be its own kind of clarity. Terseness can convey unity (eg. mathematical expressions). Terseness can help convey the lack of semantic meaning (eg. single-letter variables). By being terse we can make clear what matters and what doesn\u2019t. With verbose code, it can often be unclear the exact shape of the code. It can be unclear what the relations between parts of the code are, terseness helps us here."}),(0,r.jsx)(i.X6,{size:"2",text:"Dense vs Sparse"}),(0,r.jsxs)("p",{children:["Whereas verbose and terseness are related to the way elements are spelled out, density and sparsity are about the relations between these elements. A sparse codebase spreads its functionality out. This can take many different forms, many small classes, spread out across many files is a common example. A dense codebase packs many things into a singular place."," "]}),(0,r.jsxs)("p",{children:["In some ways, dense vs sparse might seem merely superficial, just concerned with the presentation of code rather than concepts in the code. I think this is far from true. Deciding where we place elements (regardless of what \u201cwhere\u201d here means) has a big impact on how code is understood. By grouping some things and keeping others separate, we are signaling something to other programmers."," "]}),(0,r.jsx)("p",{children:"But this is not merely a signal. We may intentionally make our code dense to, for example, discourage reuse. Large single blocks of code may only serve a very specific purpose that won\u2019t be useful to others. We might keep our code sparse to enable layering of functionality. This is often seen in classes with large inheritance hierarchy structures."}),(0,r.jsx)(i.X6,{size:"2",text:"Structured vs Unstructured"}),(0,r.jsx)("p",{children:"The contrast here between structure vs unstructured is not referring to \u201cstructured programming\u201d in the \u201cgoto considered harmful sense\u201d. Instead what I am referring to is a program-level structure. Some codebases provide an overarching structure, perhaps providing categories for where each sort of item should go (eg. MVC). Then some codebases are more free-flowing. These don\u2019t provide some sort of meta-narrative about exactly where a bit of code belongs."}),(0,r.jsx)("p",{children:"Highly structured code can be a means of communication. By placing elements inside this structure, we are communicating something about these bits of code, we are telling the reader what we consider to be the most important way bits of code are related."}),(0,r.jsx)("p",{children:"Less structured code does not communicate any less. By keeping our code less structured, we can signal several things. First, we may be saying that this code is not in its final form, it is in flux and the organization may change. We might also be communicating that this code is a complete whole and does not need to be divided into parts."}),(0,r.jsx)(i.X6,{size:"2",text:"Direct vs Indirect"}),(0,r.jsxs)("p",{children:["There are many different ways that directness can display itself in our codebases. First, we may call a function directly, or we might find some indirect means of calling this same function. Perhaps we define an interface and inject something with that interface, that then delegates to our function."," "]}),(0,r.jsx)("p",{children:"But direct and indirect are not merely about function calls. We can for example, have code that builds up some tree or hierarchical structure and then interprets it, rather than code that directly runs a computation. We might convey data onto a queue, with some consumer elsewhere rather than locally deal with our data. Directness of course comes in degrees and is relative to a particular structure. Some parts of our code will need to be direct in some way, but they may live inside of a larger indirect structure."}),(0,r.jsx)(i.X6,{size:"2",text:"Open vs Closed"}),(0,r.jsx)("p",{children:"To avoid confusion I should mention from the outset that I don\u2019t mean the Open-Closed principle from solid. Open and Closed here are a bit broader in their meaning. A system might be open by being completely introspectable. It may be closed, by encapsulating or protecting some parts of its data. But this open and closed spectrum does not need to be enforced by the language to be an aspect of our codebase. A codebase can treat a structure that is technically open as if it were closed."}),(0,r.jsxs)("p",{children:["Open vs closed does not merely refer to data protecting either. A system can be open by accepting data it is unaware of. A closed system may guard the borders, only allowing particular data in the exact shape specified. An open system may expose reflective ability, it may provide metrics, or tracing. A closed system might provide strict guarantees, correctness, performance, memory usage."," "]}),(0,r.jsx)(i.X6,{size:"2",text:"Generic vs Specific"}),(0,r.jsx)("p",{children:"Our code can be Generic or Specific on many different levels. Our function may be polymorphic, allowing it to work on different inputs. Our codebase may be solving a generic problem (a renderer) or a very specific one (a renderer for the Mandelbrot set). Even if we are solving a generic problem, our code can be specific in its details. We may provide specific instantiations of our more generic method. We could on the other hand leave our code entirely generic, acting as a framework for which people can make more specific code."}),(0,r.jsx)(i.X6,{size:"2",text:"Concrete vs Abstract"}),(0,r.jsx)("p",{children:"Concrete vs Abstract may sound a lot like generic vs specific, but I think there are important differences. First, concrete vs abstract is about the subject matter or the concepts used in the application, rather than their capabilities. To give an example, Car may be considered Concrete, whereas Monad might not. Both Car and Monad can be used generically, with more specific instances utilized elsewhere in the codebase. Admittedly, it is much easier to see how abstract code coincides with generic code. But this need not be the case. Perhaps we are writing abstract code about partially ordered sets, but using them for a very specific purpose (proving that certain properties hold)."}),(0,r.jsx)("p",{children:"Regardless, the use of concretions and abstractions in our codebase is a powerful way to communicate. By making something concrete we put bounds on it, we invite readers to apply their common conceptual categories to it. By making things abstract, we invite readers to expand the bounds of what they consider."}),(0,r.jsx)(i.X6,{size:"2",text:"An Example"}),(0,r.jsx)("p",{children:"I think these elements are great candidates for being elements of programming style. Let\u2019s take a random combination of them and think about what a program written in that style might look like."}),(0,r.jsxs)("ul",{children:[(0,r.jsx)("li",{children:"Verbose"}),(0,r.jsx)("li",{children:"Sparse"}),(0,r.jsx)("li",{children:"Structured"}),(0,r.jsx)("li",{children:"Indirect"}),(0,r.jsx)("li",{children:"Closed"}),(0,r.jsx)("li",{children:"Specific"}),(0,r.jsx)("li",{children:"Abstract"})]}),(0,r.jsx)("p",{children:"There is a lot to unpack here. First, it must be said that of course, no codebase is uniformly all these things in all its parts, so will be generalizing a bit. Second, trying to think about all these items at once is hard, so let's pair them up a bit and think through the implications of those pairings. Combing verbose and sparse might look like a library with a decent amount of boilerplate, where these boilerplate elements are rather spread out, perhaps even orthogonal to each other. We might imagine a verbose and sparse Redux or Rails codebase."}),(0,r.jsx)("p",{children:"Structured and Indirect might combine to a structured means of dispatch. We can imagine a dependency injection setup like hibernate. Nothing calls anything directly, but everything has a clear hierarchy. Here again Redux might be a good candidate to consider. A reducer structure with many sections combined with a hierarchy of selectors could meet this criterion. Closed and Structured can be combined as a means of making illegal states unrepresentable. Here, we can ensure that no one can trigger any illegal actions, everything is clearly defined, and it cannot be changed without accounting for our structure."}),(0,r.jsx)("p",{children:"Specific and Abstract are a bit harder to imagine. Imagine a web app designed to do a particular thing. It is not meant to be generally applicable or configurable, and yet the entities we find in our program are not concrete and familiar. Instead, we find things like executors, factories, or perhaps our code is organized around a free monad. While the concepts we are employing may be able to be used generally, our code is not doing this. Instead, we have very specific uses of these abstract concepts. Think, about the way people might make interfaces for everything, and yet only have one instance of them"}),(0,r.jsx)("p",{children:"So given this set, we can think about what it would be like working on a codebase following these styles. First, errors would be dealt with via our structural and closed system. Next, we would not introduce many different concrete types, instead, we would make use of abstract concepts, perhaps certain event types, or operations in an algebra. Further, things would not directly call other things or directly depend on things. Instead, these would be passed around to use or gathered through some abstract means. Further, as we introduce new concepts, we would not colocate them with existing concepts, but instead, following a pattern established by our structure, introduce them in some separate section of the codebase."}),(0,r.jsx)("p",{children:"This feels very much like some Java Spring apps I\u2019ve worked on, but also some redux apps I\u2019ve used. These two could not be further from each other in terms of paradigm, and yet, there is a shared sense of style here. Now that does not mean they are equal, it does not mean working on them feels the same, just that they share something in common. Nor do I mean to suggest all Java spring apps or all Redux apps follow this style."}),(0,r.jsx)(i.X6,{size:"2",text:"Conclusion"}),(0,r.jsxs)("p",{children:["Hopefully, these elements ring true to you. I think the most questionable distinction here is between abstract and concrete being different from specific and general. And yet, the more I try to get rid of this element, the more I see examples of it. For example, we might write general code, that we give concrete names. Maybe our code just works on some general notion of distance, but we name our parameters ",(0,r.jsx)(i.Rh,{children:"distance-in-seconds"}),". Here we have a general, concrete coding style."]}),(0,r.jsx)("p",{children:"But as I think more about this, explore more codebases and get feedback from people. Perhaps I will come up with a new set, or replace elements on here. Regardless, I think these concepts are useful and helpful for discussing code style. This is something we need to do more of."})]})}},1438:function(e,t,n){"use strict";n.d(t,{By:function(){return X},CN:function(){return C},Dx:function(){return R},Ee:function(){return y},Fz:function(){return O},Mc:function(){return B},Q_:function(){return z},R4:function(){return F},Rh:function(){return E},X6:function(){return W},rU:function(){return b}});var r=n(5893),i=n(5988),a=n.n(i),s=n(9008),o=n(1664),c=n.n(o),l=n(7294),h=n(4394),d=n(2041),u=n(8903),m=n(6410),p=n(8603);function g(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function f(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},r=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),r.forEach((function(t){g(e,t,n[t])}))}return e}var b=c(),y=function(e){var t=e.src,n=(0,l.useState)(!1),i=n[0],a=n[1],s=i?{position:"fixed",zIndex:100,top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:"80vw"}:{};return(0,r.jsxs)(r.Fragment,{children:[i&&(0,r.jsx)("div",{onClick:function(e){return a(!1)},style:{position:"fixed",top:0,left:0,width:"100vw",height:"100vh",backgroundColor:"rgb(0,0,0,0.8)"}}),(0,r.jsx)("div",{style:f({},s),children:i&&(0,r.jsx)("img",{onClick:function(){return a((function(e){return!e}))},style:{width:"100%"},src:t})}),(0,r.jsx)("img",{onClick:function(){return a((function(e){return!e}))},style:{width:"100%"},src:t})]})},w=function(e){(0,m.Z)(e),e.languages.clojure=f({},e.languages.clojure,{number:/\b-?(0x)?\d*\.?\d+\b/g,logicVariable:/(\?|!)[a-zA-Z][a-zA-Z0-9-]+/})};w.displayName="clojure",w.aliases=[],h.Z.registerLanguage("javascript",d.Z),h.Z.registerLanguage("haskell",u.Z),h.Z.registerLanguage("clojure",w);var x=function(e){var t=e.children,n=e.right,i=e.top,a=e.left;e.buttom;return(0,r.jsx)("div",{style:g({position:"absolute",right:n,left:a,top:i},"left",a),children:t})},v=function(e){var t=e.children,n=e.top,i=e.left,a=e.right,s=e.bottom;return(0,r.jsx)("div",{style:{paddingTop:n,paddingLeft:i,paddingRight:a,paddingBottom:s},children:t})},j=function(e){return function(e){var t,n=((t=e.split("\n")).length>1&&t.shift(),t),r=function(e){return/^ */.exec(e)[0].length}(n[0]);return n.map((function(e){return e.substring(r,e.length)})).join("\n")}(e)},k=f({},p.mQ,{operator:{color:"#cb4b16"},logicVariable:{color:"#2aa198"},'pre[class*="language-"]':f({},p.mQ['pre[class*="language-"]'],{backgroundColor:"#fff"})}),I=function(e){var t=e.source,n=e.language;return(0,r.jsx)(h.Z,{language:n,style:k,children:j(t)})},z=function(e){var t=e.children;return(0,r.jsx)(I,{language:"javascript",source:t})},O=function(e){var t=e.children;return(0,r.jsx)(I,{language:"haskell",source:t})},C=function(e){var t=e.children;return(0,r.jsx)(I,{language:"clojure",source:t})},S=function(){return(0,r.jsx)(a(),{id:"4dc580444c2ee173",children:"body{font-family:helvetica,sans-serif;color:#333;line-height:1.5}a{color:#333}"})},T=function(e){var t=e.children;return(0,r.jsx)("div",{style:{margin:"0 auto",maxWidth:700},children:t})},A=function(e){var t=e.children;return(0,r.jsx)("p",{style:{fontSize:"1.5em"},children:t})},B=function(e){var t=e.items,n=e.Elem,i=void 0===n?A:n,a=e.title;return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(W,{text:a}),(0,r.jsx)("ul",{children:t.map((function(e){return function(e){var t=e.href,n=e.text,i=e.Elem;return(0,r.jsx)("li",{children:(0,r.jsx)(i,{children:(0,r.jsx)(b,{href:t,children:(0,r.jsx)("a",{children:n})})})},t)}(f({},e,{Elem:i}))}))})]})},W=function(e){var t=e.color,n=e.text,i=e.size,a={1:"h1",2:"h2",3:"h3",4:"h4"}[void 0===i?1:i];return(0,r.jsx)(a,{style:{color:t},children:n})},E=function(e){var t=e.children;return(0,r.jsx)("code",{style:{backgroundColor:"rgba(27,31,35,0.05)",padding:"0.2em 0.4em",borderRadius:3,fontFamily:"Monaco, monospace",fontSize:13,whiteSpace:"nowrap"},children:t})},F=function(e){var t=e.children;return(0,r.jsx)("blockquote",{style:{paddingLeft:20,margin:0,marginLeft:20,borderLeft:"0.25em solid #dfe2e5"},children:t})},R=function(e){var t=e.text;return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(s.default,{children:(0,r.jsx)("title",{children:t})}),(0,r.jsx)(W,{text:t,size:1})]})},X=function(e){var t=e.children;return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(s.default,{children:[(0,r.jsx)("meta",{name:"viewport",content:"width=device-width, initial-scale=1"}),(0,r.jsx)("link",{rel:"icon",href:"data:;base64,iVBORw0KGgo="}),(0,r.jsx)("meta",{name:"author",content:"Jimmy Miller"}),(0,r.jsx)("link",{rel:"alternate",type:"application/rss+xml",title:"jimmyhmiller.github.io",href:"feed.xml"})]}),(0,r.jsx)(S,{}),(0,r.jsxs)(T,{children:[(0,r.jsx)("div",{style:{position:"relative"},children:(0,r.jsx)(x,{right:0,top:0,children:(0,r.jsx)(b,{href:"/",children:(0,r.jsx)("a",{style:{textDecoration:"none"},children:(0,r.jsx)(W,{color:"#999",text:"Jimmy Miller"})})})})}),(0,r.jsx)(v,{top:70,children:t})]})]})}}},function(e){e.O(0,[774,346,854,888,179],(function(){return t=934,e(e.s=t);var t}));var t=e.O();_N_E=t}]);