webpackHotUpdate("static/development/pages/meander-rewriting.js",{

/***/ "./pages/meander-rewriting.js":
/*!************************************!*\
  !*** ./pages/meander-rewriting.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils.js */ "./utils.js");
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/link */ "./node_modules/next/link.js");
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_2__);
var _jsxFileName = "/Users/jimmyhmiller/Documents/Code/jimmyhmiller.github.io/pages/meander-rewriting.js";



/* harmony default export */ __webpack_exports__["default"] = (function () {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["GlobalLayout"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 13
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Title"], {
    text: "Introduction to Term Rewriting with Meander",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 14
    },
    __self: this
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 15
    },
    __self: this
  }, "Meander is heavily inspired by the capabilities of term rewriting languages. But sadly, there aren't many introductions to term rewriting aimed at every day software engineers. Typically introductions to term rewriting immediately dive into discussing mathematical properties or proving theorems. These can be really interesting and useful in their own right. But personally I like to get an intuitive feel for something before diving into a formalism. That is the aim of this post, to help you have a more intuitive understanding of how Term Rewriting works and what it is capable of. This post will not focus on practical uses of meander, if you are interested in that check out", " ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(next_link__WEBPACK_IMPORTED_MODULE_2___default.a, {
    href: "/meander-practical/",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 26
    },
    __self: this
  }, "Meander for Practical Data Transformation"), "."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Heading"], {
    size: "2",
    text: "The Basics",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 28
    },
    __self: this
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 29
    },
    __self: this
  }, "The goal of Term Rewriting is to take some bit of data and rewrite it into some other bit of data. We accomplish this by writing rules that tell us for a given piece of data what we should turn it into.", " "), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Clojure"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 34
    },
    __self: this
  }, "\n      (require '[meander.strategy.delta :as r])\n      \n      (def x-to-y\n        (r/rewrite\n         :x :y))\n      \n      (x-to-y :x)\n      ;; =&gt; :y\n    "), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 46
    },
    __self: this
  }, "Here is the most simple rewrite rule imaginable. If we are given", " ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 48
    },
    __self: this
  }, ":x"), " we turn it into ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 48
    },
    __self: this
  }, ":y"), ". In term rewriting, the pattern we are using to match is often called the", " ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 50
    },
    __self: this
  }, "left-hand-side"), " and the data we return is called the", " ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 51
    },
    __self: this
  }, "right-hand-side"), ". So ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 51
    },
    __self: this
  }, ":x"), " is our left-hand-side and", " ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 52
    },
    __self: this
  }, ":y"), " is our right-hand-side. The data we pass in to transform is called the reducible-expression (or ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 53
    },
    __self: this
  }, "redex"), " for short)."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 55
    },
    __self: this
  }, "Admittedly, this seems almost useless, and it really is with this overly simplisitic example. But let's take it slow and build it up.", " "), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Clojure"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 59
    },
    __self: this
  }, "\n      (def rewrite-some-keywords\n        (r/rewrite\n         :x :y\n         :l :q\n         :r :t\n         :a :c))\n      \n      (rewrite-some-keywords :a)\n      ;; =&gt; :c\n    "), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 72
    },
    __self: this
  }, "Here we've extended our rewrite to have multiple rules. Now we can handle more than just ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 74
    },
    __self: this
  }, ":x"), ". Of course this is still really limiting. We definitely can't list every single possible input for all of our rules. We need a way to match any input. That is where ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 76
    },
    __self: this
  }, "variables"), " come in."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Clojure"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 78
    },
    __self: this
  }, "\n      (def match-any-thing\n        (r/rewrite\n          ?x [:matched ?x])\n      \n      (match-any-thing :a) ;; [:matched :a]\n      (match-any-thing &quot;hello&quot;) ;; [:matched &quot;hello&quot;]\n      (match-any-thing 1) ;; [:matched 1]\n    "), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 89
    },
    __self: this
  }, "Here we added the variable ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 90
    },
    __self: this
  }, "?x"), " to our left-hand-side. Variables start with a ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 91
    },
    __self: this
  }, "?"), " and match any value. Whatever they match is now accessible on the right-hand-side. So we can match anything with", " ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 93
    },
    __self: this
  }, "?x"), " and then use it in our output. Let's see a more interesting example."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Clojure"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 96
    },
    __self: this
  }, "\n      (def find-x\n        (r/rewrite\n         [?x] ?x\n         [?x ?y] ?x\n         [?x ?y ?z] ?x))\n      \n      (find-x [1]) ;; 1\n      (find-x [1 2]) ;; 1\n      (find-x [1 2 3]) ;; 1\n    "), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 109
    },
    __self: this
  }, "Here we can see some really simple rules that work on vectors of various sizes. We can use this to extract the first element from each. In this case, since we only care about ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 112
    },
    __self: this
  }, "?x"), ", we can actually simplify this code."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Clojure"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 115
    },
    __self: this
  }, "\n      (def find-x\n        (r/rewrite\n         [?x] ?x\n         [?x _] ?x\n         [?x _ _] ?x))\n    "), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 124
    },
    __self: this
  }, "The ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 125
    },
    __self: this
  }, "_"), " is a wildcard match that matches anything but doesn't bind at all. What happens if we try to extend this to work for not just vectors, but just a single number?"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Clojure"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 129
    },
    __self: this
  }, "\n      (def find-x\n        (r/rewrite\n         ?x ?x\n         [?x] ?x\n         [?x _] ?x\n         [?x _ _] ?x))\n      \n      (find-x 1) ;; 1\n      (find-x [1]) ;; [1]\n    "), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 142
    },
    __self: this
  }, "The order of our rules matter, ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 143
    },
    __self: this
  }, "?x"), " matches anything, so we will always get the first match. We could change the order, or we can constrain the match."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Clojure"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 147
    },
    __self: this
  }, "\n      (def find-x\n        (r/rewrite\n         (pred number? ?x) ?x\n         [?x] ?x\n         [?x _] ?x\n         [?x _ _] ?x))\n      \n      (find-x 1) ;; 1\n      (find-x [1]) ;; 1\n    "), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 160
    },
    __self: this
  }, "Okay, now it works. But many of you are probably thinking \"Isn't this just pattern matching?\". And in many way it is. Term Rewriting is a kind of pattern matching. But it doesn't stop with simple pattern matching. Term Rewriting is a way to do all computation through pattern matching. To see that, let's move beyond the basics."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Heading"], {
    size: "2",
    text: "Applying strategies",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 167
    },
    __self: this
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 168
    },
    __self: this
  }, "We've seen that with Meander we can do simple rewrites where we match on the left-hand-side and output a right-hand-side. But just being able to do a single rewrite in this way is really limiting. To see this problem let's consider a classic example in term rewriting."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Clojure"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 174
    },
    __self: this
  }, "\n      (def simplify-addition\n        (r/rewrite\n         (+ ?x 0) ?x\n         (+ 0 ?x) ?x))\n      \n      (simplify-addition '(+ 0 3)) ;; 3\n      (simplify-addition '(+ 3 0)) ;; 3\n    "), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 185
    },
    __self: this
  }, "Zero added to anything is just that thing. We can easily express this with term rewriting. But what if we have multple 0's nested?"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Clojure"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 189
    },
    __self: this
  }, "\n      (simplify-addition '(+ 0 (+ 0 3))) ;; (+ 0 3)\n      \n      (simplify-addition\n       (simplify-addition '(+ 0 (+ 0 3)))) ;; 3\n    "), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 197
    },
    __self: this
  }, "As you can see, the first time we apply our rules we do simplify, but not all the way. If we call our rules again, we fully simplify the expression. But how could we express this with term rewriting? We can use what are called ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 201
    },
    __self: this
  }, "strategies"), ". Strategies let use control how our terms are rewritten. Let's start with an easy strategy the ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 202
    },
    __self: this
  }, "n-times"), " ", "strategy."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Clojure"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 205
    },
    __self: this
  }, "\n      (def simplify-twice\n        (r/n-times 2 simplify-addition))\n      \n      (simplify-twice '(+ 0 (+ 0 3))) ;; 3\n    "), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 213
    },
    __self: this
  }, "Strategies wrap our rewriting rules and make them do additional things. In this case, the rewriting will be applied twice. But there are a few problems with the strategy as we've written it. Let's slowly discover those problems together and fix them."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Clojure"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 219
    },
    __self: this
  }, "\n      (simplify-twice '(+ 0 3)) ;; #meander.delta/fail[]\n    "), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 224
    },
    __self: this
  }, "Our apply-twice strategy works for things that need to be simplified twice, but not for simple cases. We can fix that by using the ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 226
    },
    __self: this
  }, "attempt"), " ", "strategy. It will try to rewrite and if it fails, just return our value."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Clojure"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 229
    },
    __self: this
  }, "\n      (def simplify-addition\n        (r/n-times 2\n          (r/attempt\n           (r/rewrite\n            (+ ?x 0) ?x\n            (+ 0 ?x) ?x))))\n      \n      (simplify-addition '(+ 0 3)) ;; 3\n      (simplify-addition '(+ 0 (+ 0 3))) ;; 3\n      (simplify-addition '(+ (+ 0 (+ 0 3)) 0)) ;; (+ 0 3)\n    "), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 243
    },
    __self: this
  }, "Now it works for both. But having it only rewrite twice is a little arbitrary. What we really want to say is to continue applying our rewrite rules until nothing changes. We can do that by using the", " ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 247
    },
    __self: this
  }, "(until =)"), " strategy."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Clojure"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 249
    },
    __self: this
  }, "\n      (def simplify-addition\n        (r/until =\n          (r/attempt\n           (r/rewrite\n            (+ ?x 0) ?x\n            (+ 0 ?x) ?x))))\n      \n      (simplify-addition '(+ (+ 0 (+ 0 3)) 0)) ;; 3\n      (simplify-addition '(+ (+ 0 (+ 0 (+ 3 (+ 2 0)))) 0)) ;; (+ 3 (+ 2 0))\n    "), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 262
    },
    __self: this
  }, "We can now simplify things no matter how deep they are, but as we can see we didn't fully eliminate 0s from all our expressions. Why is that? Well, our pattern only matches things that are in the outermost expression. We don't look at all at the sub-expressions. We can fix that by applying another strategy. In this case, we will use the ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 267
    },
    __self: this
  }, "bottom-up"), " strategy."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Clojure"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 269
    },
    __self: this
  }, "\n      (def simplify-addition\n        (r/until =\n          (r/bottom-up\n           (r/attempt\n            (r/rewrite\n             (+ ?x 0) ?x\n             (+ 0 ?x) ?x)))))\n      \n      (simplify-addition '(+ (+ 0 (+ 0 (+ 3 (+ 2 0)))) 0)) ;; (+ 3 2)\n    "), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 282
    },
    __self: this
  }, "We have now eliminated all the zeros in our additions no matter where they are in the tree. For the sake of space in our examples, we kept our rules and our strategies together, but these are actually separable. What if we wanted to try the ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 286
    },
    __self: this
  }, "top-down"), " strategy with our rules?"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Clojure"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 288
    },
    __self: this
  }, "\n      (def simplify-addition\n        (r/rewrite\n         (+ ?x 0) ?x\n         (+ 0 ?x) ?x))\n      \n      (def simplify-addition-bu\n        (r/until =\n          (r/bottom-up\n           (r/attempt simplify-addition))))\n      \n      (def simplify-addition-td\n        (r/until =\n          (r/top-down\n           (r/attempt simplify-addition))))\n    "), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 306
    },
    __self: this
  }, "Our rules are completely separate from how we want to apply them. When writing our transformations, we don't have to think at all about the context they live in. We just express our simple rules and later we can apply strategies to them. But what if we want to understand what these strategies are doing? After playing around with things, it seems that the top-down strategy and the bottom-up strategy always give us the same result. But what are they doing that is different? We can inspect our strategies at any point by using the ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 314
    },
    __self: this
  }, "trace"), " strategy."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Clojure"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 316
    },
    __self: this
  }, "\n      (def simplify-addition-bu\n        (r/until =\n          (r/trace\n           (r/bottom-up\n            (r/attempt simplify-addition)))))\n      \n      (def simplify-addition-td\n        (r/until =\n          (r/trace\n           (r/top-down\n            (r/attempt simplify-addition)))))\n    "), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 331
    },
    __self: this
  }, "So now we have modified our rewrites to trace every time the top-down or bottom-up rules are called. Let's try a fairly complicated expression and see what happens."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Clojure"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 336
    },
    __self: this
  }, "\n      (simplify-addition-td '(+ (+ (+ 0 3) (+ 0 (+ 0 (+ 2 0)))) 0)\n      \n      ;; printed\n      {:id t_20100, :in (+ (+ (+ 0 3) (+ 0 (+ 0 (+ 2 0)))) 0)}\n      {:id t_20100, :out (+ 3 (+ 0 2))}\n      {:id t_20100, :in (+ 3 (+ 0 2))}\n      {:id t_20100, :out (+ 3 2)}\n      {:id t_20100, :in (+ 3 2)}\n      {:id t_20100, :out (+ 3 2)}\n      \n      \n      (simplify-addition-bu '(+ (+ (+ 0 3) (+ 0 (+ 0 (+ 2 0)))) 0)\n      \n      ;;printed\n      {:id t_20099, :in (+ (+ (+ 0 3) (+ 0 (+ 0 (+ 2 0)))) 0)}\n      {:id t_20099, :out (+ 3 2)}\n      {:id t_20099, :in (+ 3 2)}\n      {:id t_20099, :out (+ 3 2)}\n    "), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 358
    },
    __self: this
  }, "If we look at the top-down approach, we can see that the top-down strategy actually gets called three times. Once it rewrites quite a bit, but leaves in a 0 that needs to be rewritten. Then it gets called again, eliminating all zeros. Finally it is called and nothing changes. Our bottom-up strategy however is only called twice. But we can actually get more fine grained than this. We can put trace at any point in our strategies."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Clojure"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 366
    },
    __self: this
  }, "\n      (def simplify-addition-bu\n        (r/until =\n          (r/bottom-up\n           (r/trace\n            (r/attempt simplify-addition)))))\n      \n      (simplify-addition-bu '(+ (+ 0 3) 0))\n      \n      ;; printed\n      {:id t_27317, :in +}\n      {:id t_27317, :out +}\n      {:id t_27317, :in +}\n      {:id t_27317, :out +}\n      {:id t_27317, :in 0}\n      {:id t_27317, :out 0}\n      {:id t_27317, :in 3}\n      {:id t_27317, :out 3}\n      {:id t_27317, :in (+ 0 3)}\n      {:id t_27317, :out 3}\n      {:id t_27317, :in 0}\n      {:id t_27317, :out 0}\n      {:id t_27317, :in (+ 3 0)}\n      {:id t_27317, :out 3}\n      {:id t_27317, :in 3}\n      {:id t_27317, :out 3}\n    "), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 395
    },
    __self: this
  }, "Here we moved our trace down outside our ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 396
    },
    __self: this
  }, "attempt"), " strategy. Now we can see the exact order of our bottom-up strategy. Having this sort of visibility into how the process is working is really fantastic."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Heading"], {
    size: "2",
    text: "Rewriting as General Computation",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 400
    },
    __self: this
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 401
    },
    __self: this
  }, "What have been doing so far is interesting, but it falls short of the true power of term rewriting. Term rewriting is a general programming technique. Using it we can compute absolutely anything that is computable. Let's start with a classic example, fibonacci, but to further show general computability, we will make our own numbers instead relying on Clojure's."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Clojure"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 408
    },
    __self: this
  }, "\n      (def fib-rules\n        (r/rewrite\n      \n         (+ Z ?n) ?n\n         (+ ?n Z) ?n\n      \n         (+ ?n (succ ?m)) (+ (succ ?n) ?m)\n         \n         (fib Z) Z\n         (fib (succ Z)) (succ Z)\n         (fib (succ (succ ?n))) (+ (fib (succ ?n)) (fib ?n))))\n      \n      \n      (def run-fib\n        (r/until =\n          (r/bottom-up\n           (r/attempt fib-rules))))\n      \n      [(run-fib '(fib Z))\n       (run-fib '(fib (succ Z)))\n       (run-fib '(fib (succ (succ Z))))\n       (run-fib '(fib (succ (succ (succ Z)))))\n       (run-fib '(fib (succ (succ (succ (succ Z))))))\n       (run-fib '(fib (succ (succ (succ (succ (succ Z)))))))\n       (run-fib '(fib (succ (succ (succ (succ (succ (succ Z))))))))]\n      \n      ;; [Z\n      ;;  (succ Z)\n      ;;  (succ Z)\n      ;;  (succ (succ Z))\n      ;;  (succ (succ (succ Z)))\n      ;;  (succ (succ (succ (succ (succ Z)))))\n      ;;  (succ (succ (succ (succ (succ (succ (succ (succ Z))))))))]\n    "), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 445
    },
    __self: this
  }, "If you aren't familiar with defining natural numbers via Peano numbers this may be a little bit confusing. But for our purposes all you need to know is that ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 448
    },
    __self: this
  }, "Z"), " means 0 and ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 448
    },
    __self: this
  }, "succ"), " means successor.", " ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 449
    },
    __self: this
  }, "(succ Z)"), " means 1 ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 449
    },
    __self: this
  }, "(succ (succ Z))"), " means 2 and so on and so forth. Our fibonacci rules start by defining addition for our Peano numbers. Anything added to 0 is zero. Otherwise, we can add two numbers by moving all the ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 452
    },
    __self: this
  }, "succ"), "s to one side until the right hand side equals 0. With those definitions in place, we can define fibonacci, which is basically just the definition of fibonacci. With term rewriting our strategies can enable us to have recursion without directly implementing it. Our rules read like they are recursive. But our rules don't call a function. They don't cause anything to occur. They just return more data. It is the process of interpretation that makes them recursive."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 460
    },
    __self: this
  }, "In fact, with Meander, we are limited to what the clojure reader can interpret, but in general with term rewriting, the syntax doesn't matter. I wrote things as ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 463
    },
    __self: this
  }, "(fib n)"), " merely as convention. I could have writen ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 464
    },
    __self: this
  }, "(n fib)"), ". There is nothing special about the syntax other than what rules we apply to it.", " "), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Heading"], {
    size: "2",
    text: "Why Should We Care?",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 467
    },
    __self: this
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 468
    },
    __self: this
  }, "Admittedly the example of fibonacci above isn't very useful. And of course if we had a real language, we would never want a number system like that. So why should we care about term rewriting? Term Rewriting offers a powerful yet simple way of viewing programming. It gives us the potential to take the lisp montra that code is data and data is code much more seriously. How so? First, in lisps functions might be values, but they are opaque. Evaluating a function defintion returns you something that you can't inspect directly. Something you can't directly transform (", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 476
    },
    __self: this
  }, "#function[]"), " in clojure). With term rewriting things can just remain data, because we have separated execution from description."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 480
    },
    __self: this
  }, "Not only can our \"code\" be data more than it can in lisp, but we can actually have our execution as data. Executing a Term Rewriting rule is just taking in data, matching on it and producing more data. That means all our intermediate values are data. The entire execution of our program now becomes data. Have you ever run your program and had no idea where a certain value came from? Well, imagine if you could just ask your language to pattern match on every intermediate value that contains that value. Or maybe, give me that last 5 steps that led to this value. With Term Rewriting this is entirely possible."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 491
    },
    __self: this
  }, "Term Rewriting also gives us an easy basis for talking about partial programs. Our current programming languages have a problem where if they encounter something they don't understand, they just blow up, not telling us anything. Let's consider the following program:"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Clojure"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 497
    },
    __self: this
  }, "\n      (+ 3 4 (unimplemented!))\n    "), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 502
    },
    __self: this
  }, "What does the program return? Well as its name is clear, unimplemented is in fact, unimplemented. So most languages, will just throw an error. That can be what we want at times. But as people, we can look at that code and tell something else. We know that it will return ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 506
    },
    __self: this
  }, "(+ 7 something)"), ". Why can't our languages tell us that? Why can't we start writing partial programs and run them continually refining things as we go? Term Rewriting gives us this ability."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Heading"], {
    size: "2",
    text: "Term Rewriting as Programming Paradigm",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 511
    },
    __self: this
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 512
    },
    __self: this
  }, "Term Rewriting represents a distinct way of programming. It offers us a uniform way of dealing with data. It gives us the ability to think about things as syntactic structures. It offers us a way to truly have code as data, to go beyond the arbitrary distinctions imposed by our languages about what can and cannot be manipulated. It is a fundamental shift in how we view programs. It gives us new perspectives, new ways of thinking about how code executes and what our programs mean."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 521
    },
    __self: this
  }, "Meander isn't at that point. But it is the beginning of an exploration into how to get there. In many ways, Meander is a testament to the flexiblity of lisps and Clojure in particular. Using Clojure rich data literals and macros we are able to embed our own language inside it. Yet at the same time, Meander pushes us beyond the way we've traditionally conceived of programming. Maybe functions aren't the best abstraction for working with data. Could programming be better if we truly had a way to work with data directly? That is Meander's conviction and its chief aim."));
});

/***/ }),

/***/ "./utils.js":
/*!******************!*\
  !*** ./utils.js ***!
  \******************/
/*! exports provided: AbsolutePosition, Padding, Margin, detectIndent, removeIndent, formatCode, modifiedSolarizedLight, Code, Javascript, Haskell, Clojure, LargeText, LinkList, Heading, Term, BlockQuote, Title, GlobalLayout */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AbsolutePosition", function() { return AbsolutePosition; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Padding", function() { return Padding; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Margin", function() { return Margin; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "detectIndent", function() { return detectIndent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeIndent", function() { return removeIndent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "formatCode", function() { return formatCode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "modifiedSolarizedLight", function() { return modifiedSolarizedLight; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Code", function() { return Code; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Javascript", function() { return Javascript; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Haskell", function() { return Haskell; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Clojure", function() { return Clojure; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LargeText", function() { return LargeText; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LinkList", function() { return LinkList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Heading", function() { return Heading; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Term", function() { return Term; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BlockQuote", function() { return BlockQuote; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Title", function() { return Title; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GlobalLayout", function() { return GlobalLayout; });
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/defineProperty */ "./node_modules/@babel/runtime-corejs2/helpers/esm/defineProperty.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_objectSpread__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/objectSpread */ "./node_modules/@babel/runtime-corejs2/helpers/esm/objectSpread.js");
/* harmony import */ var styled_jsx_style__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! styled-jsx/style */ "./node_modules/styled-jsx/style.js");
/* harmony import */ var styled_jsx_style__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(styled_jsx_style__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! next/head */ "./node_modules/next-server/dist/lib/head.js");
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! next/link */ "./node_modules/next/link.js");
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var react_syntax_highlighter_dist_cjs_prism_light__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-syntax-highlighter/dist/cjs/prism-light */ "./node_modules/react-syntax-highlighter/dist/cjs/prism-light.js");
/* harmony import */ var react_syntax_highlighter_dist_cjs_prism_light__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_syntax_highlighter_dist_cjs_prism_light__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var react_syntax_highlighter_dist_cjs_languages_prism_javascript__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-syntax-highlighter/dist/cjs/languages/prism/javascript */ "./node_modules/react-syntax-highlighter/dist/cjs/languages/prism/javascript.js");
/* harmony import */ var react_syntax_highlighter_dist_cjs_languages_prism_javascript__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_syntax_highlighter_dist_cjs_languages_prism_javascript__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var react_syntax_highlighter_dist_cjs_languages_prism_haskell__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-syntax-highlighter/dist/cjs/languages/prism/haskell */ "./node_modules/react-syntax-highlighter/dist/cjs/languages/prism/haskell.js");
/* harmony import */ var react_syntax_highlighter_dist_cjs_languages_prism_haskell__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react_syntax_highlighter_dist_cjs_languages_prism_haskell__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var react_syntax_highlighter_dist_cjs_languages_prism_clojure__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-syntax-highlighter/dist/cjs/languages/prism/clojure */ "./node_modules/react-syntax-highlighter/dist/cjs/languages/prism/clojure.js");
/* harmony import */ var react_syntax_highlighter_dist_cjs_languages_prism_clojure__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(react_syntax_highlighter_dist_cjs_languages_prism_clojure__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var react_syntax_highlighter_dist_styles_prism__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-syntax-highlighter/dist/styles/prism */ "./node_modules/react-syntax-highlighter/dist/styles/prism/index.js");
/* harmony import */ var react_syntax_highlighter_dist_styles_prism__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(react_syntax_highlighter_dist_styles_prism__WEBPACK_IMPORTED_MODULE_10__);


var _jsxFileName = "/Users/jimmyhmiller/Documents/Code/jimmyhmiller.github.io/utils.js";








 // Super ugly hack to override prism languages
// I really should make a modern prism, but I will
// never find time to do that. Warning to future me
// this causes some weird stuff with hot reloading when changed.

var clojure2 = function clojure2(Prism) {
  react_syntax_highlighter_dist_cjs_languages_prism_clojure__WEBPACK_IMPORTED_MODULE_9___default()(Prism);
  Prism.languages.clojure = Object(_babel_runtime_corejs2_helpers_esm_objectSpread__WEBPACK_IMPORTED_MODULE_1__["default"])({}, Prism.languages.clojure, {
    number: /\b-?(0x)?\d*\.?\d+\b/g,
    logicVariable: /(\?|!)[a-zA-Z][a-zA-Z0-9-]+/
  });
};

clojure2.displayName = 'clojure';
clojure2.aliases = [];
react_syntax_highlighter_dist_cjs_prism_light__WEBPACK_IMPORTED_MODULE_6___default.a.registerLanguage('javascript', react_syntax_highlighter_dist_cjs_languages_prism_javascript__WEBPACK_IMPORTED_MODULE_7___default.a);
react_syntax_highlighter_dist_cjs_prism_light__WEBPACK_IMPORTED_MODULE_6___default.a.registerLanguage('haskell', react_syntax_highlighter_dist_cjs_languages_prism_haskell__WEBPACK_IMPORTED_MODULE_8___default.a);
react_syntax_highlighter_dist_cjs_prism_light__WEBPACK_IMPORTED_MODULE_6___default.a.registerLanguage('clojure', clojure2);
var AbsolutePosition = function AbsolutePosition(_ref) {
  var children = _ref.children,
      right = _ref.right,
      top = _ref.top,
      left = _ref.left,
      buttom = _ref.buttom;
  return react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement("div", {
    style: Object(_babel_runtime_corejs2_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])({
      position: "absolute",
      right: right,
      left: left,
      top: top
    }, "left", left),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 31
    },
    __self: this
  }, children);
};
var Padding = function Padding(_ref3) {
  var children = _ref3.children,
      top = _ref3.top,
      left = _ref3.left,
      right = _ref3.right,
      bottom = _ref3.bottom;
  return react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement("div", {
    style: {
      paddingTop: top,
      paddingLeft: left,
      paddingRight: right,
      paddingBottom: bottom
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 36
    },
    __self: this
  }, children);
};
var Margin = function Margin(_ref4) {
  var children = _ref4.children,
      top = _ref4.top,
      left = _ref4.left,
      right = _ref4.right,
      bottom = _ref4.bottom;
  return react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement("div", {
    style: {
      marginTop: top,
      marginLeft: left,
      marginRight: right,
      marginBottom: bottom
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 46
    },
    __self: this
  }, children);
};

var removeFirst = function removeFirst(arr) {
  if (arr.length > 1) {
    arr.shift();
  }

  return arr;
};

var detectIndent = function detectIndent(source) {
  return /^ */.exec(source)[0].length;
};
var removeIndent = function removeIndent(source) {
  var lines, indent;
  return lines = removeFirst(source.split("\n")), indent = detectIndent(lines[0]), lines.map(function (s) {
    return s.substring(indent, s.length);
  }).join("\n");
};
var formatCode = function formatCode(source) {
  return removeIndent(source);
};
var modifiedSolarizedLight = Object(_babel_runtime_corejs2_helpers_esm_objectSpread__WEBPACK_IMPORTED_MODULE_1__["default"])({}, react_syntax_highlighter_dist_styles_prism__WEBPACK_IMPORTED_MODULE_10__["solarizedlight"], {
  "operator": {
    color: "#cb4b16"
  },
  "logicVariable": {
    color: "#2aa198"
  },
  "pre[class*=\"language-\"]": Object(_babel_runtime_corejs2_helpers_esm_objectSpread__WEBPACK_IMPORTED_MODULE_1__["default"])({}, react_syntax_highlighter_dist_styles_prism__WEBPACK_IMPORTED_MODULE_10__["solarizedlight"]["pre[class*=\"language-\"]"], {
    backgroundColor: "#fff"
  })
});
var Code = function Code(_ref5) {
  var source = _ref5.source,
      language = _ref5.language;
  return react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(react_syntax_highlighter_dist_cjs_prism_light__WEBPACK_IMPORTED_MODULE_6___default.a, {
    language: language,
    style: modifiedSolarizedLight,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 95
    },
    __self: this
  }, formatCode(source));
};
var Javascript = function Javascript(_ref6) {
  var children = _ref6.children;
  return react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(Code, {
    language: "javascript",
    source: children,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 105
    },
    __self: this
  });
};
var Haskell = function Haskell(_ref7) {
  var children = _ref7.children;
  return react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(Code, {
    language: "haskell",
    source: children,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 110
    },
    __self: this
  });
};
var Clojure = function Clojure(_ref8) {
  var children = _ref8.children;
  return react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(Code, {
    language: "clojure",
    source: children,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 115
    },
    __self: this
  });
};

var GlobalStyles = function GlobalStyles() {
  return react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(styled_jsx_style__WEBPACK_IMPORTED_MODULE_2___default.a, {
    id: "1541984143",
    __self: this
  }, "body{font-family:helvetica,sans-serif;color:#333;line-height:1.5;}a{color:#333;}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qaW1teWhtaWxsZXIvRG9jdW1lbnRzL0NvZGUvamltbXlobWlsbGVyLmdpdGh1Yi5pby91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUF3SEksQUFHMkMsQUFLdkIsV0FDYixzQkFMYSxXQUNLLGdCQUNsQiIsImZpbGUiOiIvVXNlcnMvamltbXlobWlsbGVyL0RvY3VtZW50cy9Db2RlL2ppbW15aG1pbGxlci5naXRodWIuaW8vdXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSGVhZCBmcm9tICduZXh0L2hlYWQnO1xuaW1wb3J0IExpbmsgZnJvbSAnbmV4dC9saW5rJztcbmltcG9ydCBTeW50YXhIaWdobGlnaHRlciBmcm9tIFwicmVhY3Qtc3ludGF4LWhpZ2hsaWdodGVyL2Rpc3QvY2pzL3ByaXNtLWxpZ2h0XCI7XG5pbXBvcnQganMgZnJvbSAncmVhY3Qtc3ludGF4LWhpZ2hsaWdodGVyL2Rpc3QvY2pzL2xhbmd1YWdlcy9wcmlzbS9qYXZhc2NyaXB0JztcbmltcG9ydCBoYXNrZWxsIGZyb20gJ3JlYWN0LXN5bnRheC1oaWdobGlnaHRlci9kaXN0L2Nqcy9sYW5ndWFnZXMvcHJpc20vaGFza2VsbCc7XG5pbXBvcnQgY2xvanVyZSBmcm9tICdyZWFjdC1zeW50YXgtaGlnaGxpZ2h0ZXIvZGlzdC9janMvbGFuZ3VhZ2VzL3ByaXNtL2Nsb2p1cmUnO1xuaW1wb3J0IHsgc29sYXJpemVkbGlnaHQgfSBmcm9tICdyZWFjdC1zeW50YXgtaGlnaGxpZ2h0ZXIvZGlzdC9zdHlsZXMvcHJpc20nO1xuXG4vLyBTdXBlciB1Z2x5IGhhY2sgdG8gb3ZlcnJpZGUgcHJpc20gbGFuZ3VhZ2VzXG4vLyBJIHJlYWxseSBzaG91bGQgbWFrZSBhIG1vZGVybiBwcmlzbSwgYnV0IEkgd2lsbFxuLy8gbmV2ZXIgZmluZCB0aW1lIHRvIGRvIHRoYXQuIFdhcm5pbmcgdG8gZnV0dXJlIG1lXG4vLyB0aGlzIGNhdXNlcyBzb21lIHdlaXJkIHN0dWZmIHdpdGggaG90IHJlbG9hZGluZyB3aGVuIGNoYW5nZWQuXG5jb25zdCBjbG9qdXJlMiA9IChQcmlzbSkgPT4ge1xuICBjbG9qdXJlKFByaXNtKTtcbiAgUHJpc20ubGFuZ3VhZ2VzLmNsb2p1cmUgPSB7XG4gICAgLi4uUHJpc20ubGFuZ3VhZ2VzLmNsb2p1cmUsXG4gICAgbnVtYmVyOiAvXFxiLT8oMHgpP1xcZCpcXC4/XFxkK1xcYi9nLFxuICAgIGxvZ2ljVmFyaWFibGU6IC8oXFw/fCEpW2EtekEtWl1bYS16QS1aMC05LV0rLyxcbiAgfVxufVxuY2xvanVyZTIuZGlzcGxheU5hbWUgPSAnY2xvanVyZSdcbmNsb2p1cmUyLmFsaWFzZXMgPSBbXVxuXG5TeW50YXhIaWdobGlnaHRlci5yZWdpc3Rlckxhbmd1YWdlKCdqYXZhc2NyaXB0JywganMpO1xuU3ludGF4SGlnaGxpZ2h0ZXIucmVnaXN0ZXJMYW5ndWFnZSgnaGFza2VsbCcsIGhhc2tlbGwpO1xuU3ludGF4SGlnaGxpZ2h0ZXIucmVnaXN0ZXJMYW5ndWFnZSgnY2xvanVyZScsIGNsb2p1cmUyKVxuXG5cblxuZXhwb3J0IGNvbnN0IEFic29sdXRlUG9zaXRpb24gPSAoeyBjaGlsZHJlbiwgcmlnaHQsIHRvcCwgbGVmdCwgYnV0dG9tfSkgPT5cbiAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246IFwiYWJzb2x1dGVcIiwgcmlnaHQsIGxlZnQsIHRvcCxsZWZ0fX0+XG4gICAgICB7Y2hpbGRyZW59XG4gICA8L2Rpdj5cblxuZXhwb3J0IGNvbnN0IFBhZGRpbmcgPSAoeyBjaGlsZHJlbiwgdG9wLCBsZWZ0LCByaWdodCwgYm90dG9tIH0pID0+XG4gICA8ZGl2IHN0eWxlPXt7XG4gICAgICBwYWRkaW5nVG9wOiB0b3AsXG4gICAgICBwYWRkaW5nTGVmdDogbGVmdCxcbiAgICAgIHBhZGRpbmdSaWdodDogcmlnaHQsXG4gICAgICBwYWRkaW5nQm90dG9tOiBib3R0b20sXG4gICB9fT5cbiAgICAgIHtjaGlsZHJlbn1cbiAgIDwvZGl2PlxuXG5leHBvcnQgY29uc3QgTWFyZ2luID0gKHsgY2hpbGRyZW4sIHRvcCwgbGVmdCwgcmlnaHQsIGJvdHRvbSB9KSA9PlxuICAgPGRpdiBzdHlsZT17e1xuICAgICAgbWFyZ2luVG9wOiB0b3AsXG4gICAgICBtYXJnaW5MZWZ0OiBsZWZ0LFxuICAgICAgbWFyZ2luUmlnaHQ6IHJpZ2h0LFxuICAgICAgbWFyZ2luQm90dG9tOiBib3R0b20sXG4gICB9fT5cbiAgICAgIHtjaGlsZHJlbn1cbiAgIDwvZGl2PlxuXG5jb25zdCByZW1vdmVGaXJzdCA9IChhcnIpID0+IHtcbiAgaWYgKGFyci5sZW5ndGggPiAxKSB7XG4gICAgYXJyLnNoaWZ0KCk7XG4gIH1cbiAgcmV0dXJuIGFycjtcbn1cblxuZXhwb3J0IGNvbnN0IGRldGVjdEluZGVudCA9IHNvdXJjZSA9PlxuICAvXiAqLy5leGVjKHNvdXJjZSlbMF0ubGVuZ3RoXG5cbmV4cG9ydCBjb25zdCByZW1vdmVJbmRlbnQgPSAoc291cmNlKSA9PiBkbyB7XG4gIGNvbnN0IGxpbmVzID0gcmVtb3ZlRmlyc3Qoc291cmNlLnNwbGl0KFwiXFxuXCIpKVxuICBjb25zdCBpbmRlbnQgPSBkZXRlY3RJbmRlbnQobGluZXNbMF0pXG4gIGxpbmVzXG4gICAgLm1hcChzID0+IHMuc3Vic3RyaW5nKGluZGVudCwgcy5sZW5ndGgpKVxuICAgIC5qb2luKFwiXFxuXCIpXG59XG5cblxuZXhwb3J0IGNvbnN0IGZvcm1hdENvZGUgPSAoc291cmNlKSA9PiB7XG4gIHJldHVybiByZW1vdmVJbmRlbnQoc291cmNlKVxufVxuXG5cbmV4cG9ydCBjb25zdCBtb2RpZmllZFNvbGFyaXplZExpZ2h0ID0ge1xuICAuLi5zb2xhcml6ZWRsaWdodCxcbiAgXCJvcGVyYXRvclwiOiB7XG4gICAgY29sb3I6IFwiI2NiNGIxNlwiXG4gIH0sXG4gIFwibG9naWNWYXJpYWJsZVwiOiB7XG4gICAgY29sb3I6IFwiIzJhYTE5OFwiXG4gIH0sXG4gIFwicHJlW2NsYXNzKj1cXFwibGFuZ3VhZ2UtXFxcIl1cIjoge1xuICAgIC4uLnNvbGFyaXplZGxpZ2h0W1wicHJlW2NsYXNzKj1cXFwibGFuZ3VhZ2UtXFxcIl1cIl0sXG4gICAgYmFja2dyb3VuZENvbG9yOiBcIiNmZmZcIixcbiAgfSxcbn1cblxuZXhwb3J0IGNvbnN0IENvZGUgPSAoeyBzb3VyY2UsIGxhbmd1YWdlIH0pID0+IHtcbiAgcmV0dXJuIChcbiAgICA8U3ludGF4SGlnaGxpZ2h0ZXJcbiAgICAgIGxhbmd1YWdlPXtsYW5ndWFnZX1cbiAgICAgIHN0eWxlPXttb2RpZmllZFNvbGFyaXplZExpZ2h0fVxuICAgID5cbiAgICAgIHtmb3JtYXRDb2RlKHNvdXJjZSl9XG4gICAgPC9TeW50YXhIaWdobGlnaHRlcj5cbiAgKVxufVxuXG5leHBvcnQgY29uc3QgSmF2YXNjcmlwdCA9ICh7IGNoaWxkcmVuIH0pID0+IFxuICA8Q29kZVxuICAgIGxhbmd1YWdlPVwiamF2YXNjcmlwdFwiXG4gICAgc291cmNlPXtjaGlsZHJlbn0gLz5cblxuZXhwb3J0IGNvbnN0IEhhc2tlbGwgPSAoeyBjaGlsZHJlbiB9KSA9PiBcbiAgPENvZGVcbiAgICBsYW5ndWFnZT1cImhhc2tlbGxcIlxuICAgIHNvdXJjZT17Y2hpbGRyZW59IC8+XG5cbmV4cG9ydCBjb25zdCBDbG9qdXJlID0gKHsgY2hpbGRyZW4gfSkgPT4gXG4gIDxDb2RlXG4gICAgbGFuZ3VhZ2U9XCJjbG9qdXJlXCJcbiAgICBzb3VyY2U9e2NoaWxkcmVufSAvPlxuXG5jb25zdCBHbG9iYWxTdHlsZXMgPSAoKSA9PiBcbiAgIDxzdHlsZSBnbG9iYWwganN4PlxuICAge2BcbiAgICAgIGJvZHkge1xuICAgICAgICBmb250LWZhbWlseTogaGVsdmV0aWNhLCBzYW5zLXNlcmlmO1xuICAgICAgICBjb2xvcjogIzMzMztcbiAgICAgICAgbGluZS1oZWlnaHQ6IDEuNTtcbiAgICAgIH1cbiAgICAgIGEge1xuICAgICAgICBjb2xvcjogIzMzMztcbiAgICAgIH1cbiAgIGB9XG4gICA8L3N0eWxlPlxuXG5jb25zdCBDb250YWluZXIgPSAoe2NoaWxkcmVufSkgPT5cbiAgIDxkaXYgc3R5bGU9e3tcbiAgICAgIG1hcmdpbjogXCIwIGF1dG9cIixcbiAgICAgIG1heFdpZHRoOiA3MDAsXG4gICB9fT5cbiAgICAgIHtjaGlsZHJlbn1cbiAgIDwvZGl2PlxuXG5jb25zdCBMaXN0SXRlbSA9ICh7IGhyZWYsIHRleHQsIEVsZW0gfSkgPT5cbiAgPGxpIGtleT17aHJlZn0+XG4gICAgPEVsZW0+XG4gICAgICA8TGluayBocmVmPXtocmVmfSBhcz17aHJlZiArIFwiL1wifT5cbiAgICAgICAgPGE+e3RleHR9PC9hPlxuICAgICAgPC9MaW5rPlxuICAgIDwvRWxlbT5cbiAgPC9saT5cblxuZXhwb3J0IGNvbnN0IExhcmdlVGV4dCA9ICh7IGNoaWxkcmVuIH0pID0+IFxuICA8cCBzdHlsZT17e2ZvbnRTaXplOiBcIjEuNWVtXCJ9fT5cbiAgICB7Y2hpbGRyZW59XG4gIDwvcD5cblxuZXhwb3J0IGNvbnN0IExpbmtMaXN0ID0gKHsgaXRlbXMsIEVsZW09TGFyZ2VUZXh0LCB0aXRsZSB9KSA9PlxuICA8PlxuICAgIDxIZWFkaW5nIHRleHQ9e3RpdGxlfSAvPlxuICAgIDx1bD5cbiAgICAgIHtpdGVtcy5tYXAoaXRlbSA9PiBMaXN0SXRlbSh7Li4uaXRlbSwgRWxlbX0pKX1cbiAgICA8L3VsPlxuICA8Lz5cblxuZXhwb3J0IGNvbnN0IEhlYWRpbmcgPSAoeyBjb2xvciwgdGV4dCwgc2l6ZT0xIH0pID0+IGRvIHtcbiAgY29uc3Qgc2l6ZVRvRWxlbSA9IHsxOiBcImgxXCIsIDI6IFwiaDJcIiwgMzogXCJoM1wiLCBcIjRcIjogXCJoNFwifVxuICBjb25zdCBFbGVtID0gc2l6ZVRvRWxlbVtzaXplXTtcbiAgPEVsZW0gc3R5bGU9e3sgY29sb3IgfX0+XG4gICAge3RleHR9XG4gIDwvRWxlbT5cbn1cblxuZXhwb3J0IGNvbnN0IFRlcm0gPSAoe2NoaWxkcmVufSkgPT5cbiAgPGNvZGUgc3R5bGU9e3tcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IFwicmdiYSgyNywzMSwzNSwwLjA1KVwiLFxuICAgIHBhZGRpbmc6IFwiMC4yZW0gMC40ZW1cIixcbiAgICBib3JkZXJSYWRpdXM6IDMsXG4gICAgZm9udEZhbWlseTogXCJNb25hY28sIG1vbm9zcGFjZVwiLFxuICAgIGZvbnRTaXplOiAxMyxcbiAgICB3aGl0ZVNwYWNlOiBcIm5vd3JhcFwiLFxuICB9fT5cbiAgICB7Y2hpbGRyZW59XG4gIDwvY29kZT5cblxuZXhwb3J0IGNvbnN0IEJsb2NrUXVvdGUgPSAoe2NoaWxkcmVufSkgPT5cbiAgPGJsb2NrcXVvdGUgc3R5bGU9e3tcbiAgICBwYWRkaW5nTGVmdDogMjAsXG4gICAgbWFyZ2luOiAwLFxuICAgIG1hcmdpbkxlZnQ6IDIwLFxuICAgIGJvcmRlckxlZnQ6IFwiMC4yNWVtIHNvbGlkICNkZmUyZTVcIixcbiAgfX0+XG4gICAge2NoaWxkcmVufVxuICA8L2Jsb2NrcXVvdGU+XG5cbmV4cG9ydCBjb25zdCBUaXRsZSA9ICh7IHRleHQgfSkgPT4gXG4gIDw+XG4gICAgPEhlYWQ+XG4gICAgICA8dGl0bGU+e3RleHR9PC90aXRsZT5cbiAgICA8L0hlYWQ+XG4gICAgPEhlYWRpbmcgdGV4dD17dGV4dH0gc2l6ZT17MX0gLz5cbiAgPC8+XG5cblxuZXhwb3J0IGNvbnN0IEdsb2JhbExheW91dCA9ICh7IGNoaWxkcmVuIH0pID0+XG4gIDw+XG4gICAgPEhlYWQ+XG4gICAgICA8bWV0YSBuYW1lPVwidmlld3BvcnRcIiBjb250ZW50PVwid2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTFcIiAvPlxuICAgICAgPGxpbmsgcmVsPVwiaWNvblwiIGhyZWY9XCJkYXRhOjtiYXNlNjQsaVZCT1J3MEtHZ289XCIgLz5cbiAgICAgIDxtZXRhIG5hbWU9XCJhdXRob3JcIiBjb250ZW50PVwiSmltbXkgTWlsbGVyXCIgLz5cbiAgICA8L0hlYWQ+XG4gICAgPEdsb2JhbFN0eWxlcyAvPlxuICAgIDxDb250YWluZXI+XG4gICAgICA8ZGl2IHN0eWxlPXt7cG9zaXRpb246IFwicmVsYXRpdmVcIn19PlxuICAgICAgICAgIDxBYnNvbHV0ZVBvc2l0aW9uIHJpZ2h0PXswfSB0b3A9ezB9PlxuICAgICAgICAgIDxMaW5rICBocmVmPVwiL1wiID5cbiAgICAgICAgICAgIDxhIHN0eWxlPXt7dGV4dERlY29yYXRpb246IFwibm9uZVwifX0+XG4gICAgICAgICAgICAgIDxIZWFkaW5nXG4gICAgICAgICAgICAgICAgIGNvbG9yPVwiIzk5OVwiXG4gICAgICAgICAgICAgICAgIHRleHQ9XCJKaW1teSBNaWxsZXJcIi8+XG4gICAgICAgICAgICA8L2E+XG4gICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICA8L0Fic29sdXRlUG9zaXRpb24+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxQYWRkaW5nIHRvcD17NzB9PlxuICAgICAgICB7Y2hpbGRyZW59XG4gICAgICA8L1BhZGRpbmc+XG4gICAgPC9Db250YWluZXI+XG4gIDwvPlxuXG5cbiJdfQ== */\n/*@ sourceURL=/Users/jimmyhmiller/Documents/Code/jimmyhmiller.github.io/utils.js */");
};

var Container = function Container(_ref9) {
  var children = _ref9.children;
  return react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement("div", {
    style: {
      margin: "0 auto",
      maxWidth: 700
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 134
    },
    __self: this
  }, children);
};

var ListItem = function ListItem(_ref10) {
  var href = _ref10.href,
      text = _ref10.text,
      Elem = _ref10.Elem;
  return react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement("li", {
    key: href,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 142
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(Elem, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 143
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(next_link__WEBPACK_IMPORTED_MODULE_5___default.a, {
    href: href,
    as: href + "/",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 144
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement("a", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 145
    },
    __self: this
  }, text))));
};

var LargeText = function LargeText(_ref11) {
  var children = _ref11.children;
  return react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement("p", {
    style: {
      fontSize: "1.5em"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 151
    },
    __self: this
  }, children);
};
var LinkList = function LinkList(_ref12) {
  var items = _ref12.items,
      _ref12$Elem = _ref12.Elem,
      Elem = _ref12$Elem === void 0 ? LargeText : _ref12$Elem,
      title = _ref12.title;
  return react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_3___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(Heading, {
    text: title,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 157
    },
    __self: this
  }), react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement("ul", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 158
    },
    __self: this
  }, items.map(function (item) {
    return ListItem(Object(_babel_runtime_corejs2_helpers_esm_objectSpread__WEBPACK_IMPORTED_MODULE_1__["default"])({}, item, {
      Elem: Elem
    }));
  })));
};
var Heading = function Heading(_ref13) {
  var sizeToElem, Elem;
  var color = _ref13.color,
      text = _ref13.text,
      _ref13$size = _ref13.size,
      size = _ref13$size === void 0 ? 1 : _ref13$size;
  return sizeToElem = {
    1: "h1",
    2: "h2",
    3: "h3",
    "4": "h4"
  }, Elem = sizeToElem[size], react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(Elem, {
    style: {
      color: color
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 166
    },
    __self: this
  }, text);
};
var Term = function Term(_ref14) {
  var children = _ref14.children;
  return react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement("code", {
    style: {
      backgroundColor: "rgba(27,31,35,0.05)",
      padding: "0.2em 0.4em",
      borderRadius: 3,
      fontFamily: "Monaco, monospace",
      fontSize: 13,
      whiteSpace: "nowrap"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 172
    },
    __self: this
  }, children);
};
var BlockQuote = function BlockQuote(_ref15) {
  var children = _ref15.children;
  return react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement("blockquote", {
    style: {
      paddingLeft: 20,
      margin: 0,
      marginLeft: 20,
      borderLeft: "0.25em solid #dfe2e5"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 184
    },
    __self: this
  }, children);
};
var Title = function Title(_ref16) {
  var text = _ref16.text;
  return react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_3___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(next_head__WEBPACK_IMPORTED_MODULE_4___default.a, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 195
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement("title", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 196
    },
    __self: this
  }, text)), react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(Heading, {
    text: text,
    size: 1,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 198
    },
    __self: this
  }));
};
var GlobalLayout = function GlobalLayout(_ref17) {
  var children = _ref17.children;
  return react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_3___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(next_head__WEBPACK_IMPORTED_MODULE_4___default.a, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 204
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement("meta", {
    name: "viewport",
    content: "width=device-width, initial-scale=1",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 205
    },
    __self: this
  }), react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement("link", {
    rel: "icon",
    href: "data:;base64,iVBORw0KGgo=",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 206
    },
    __self: this
  }), react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement("meta", {
    name: "author",
    content: "Jimmy Miller",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 207
    },
    __self: this
  })), react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(GlobalStyles, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 209
    },
    __self: this
  }), react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(Container, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 210
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement("div", {
    style: {
      position: "relative"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 211
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(AbsolutePosition, {
    right: 0,
    top: 0,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 212
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(next_link__WEBPACK_IMPORTED_MODULE_5___default.a, {
    href: "/",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 213
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement("a", {
    style: {
      textDecoration: "none"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 214
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(Heading, {
    color: "#999",
    text: "Jimmy Miller",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 215
    },
    __self: this
  }))))), react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(Padding, {
    top: 70,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 222
    },
    __self: this
  }, children)));
};

/***/ })

})
//# sourceMappingURL=meander-rewriting.js.3d6917a115d3145df5ed.hot-update.js.map