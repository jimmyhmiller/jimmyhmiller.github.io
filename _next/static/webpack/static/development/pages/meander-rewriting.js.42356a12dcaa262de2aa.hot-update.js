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
  }, "\n      (require '[meander.strategy.delta :as r])\n      \n      (def x-to-y\n        (r/rewrite\n         :x :y))\n      \n      (x-to-y :x)\n      ;; => :y\n    "), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
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
  }, "\n      (def rewrite-some-keywords\n        (r/rewrite\n         :x :y\n         :l :q\n         :r :t\n         :a :c))\n      \n      (rewrite-some-keywords :a)\n      ;; => :c\n    "), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
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
  }, "\n      (def match-any-thing\n        (r/rewrite\n          ?x [:matched ?x])\n      \n      (match-any-thing :a) ;; [:matched :a]\n      (match-any-thing \"hello\") ;; [:matched \"hello\"]\n      (match-any-thing 1) ;; [:matched 1]\n    "), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
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
  }, "strategies"), ". Strategies let us control how our terms are rewritten. Let's start with an easy strategy the ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
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

/***/ })

})
//# sourceMappingURL=meander-rewriting.js.42356a12dcaa262de2aa.hot-update.js.map