webpackHotUpdate("static/development/pages/meander-practical.js",{

/***/ "./pages/meander-practical.js":
/*!************************************!*\
  !*** ./pages/meander-practical.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils.js */ "./utils.js");
var _jsxFileName = "/Users/jimmyhmiller/Documents/Code/jimmyhmiller.github.io/pages/meander-practical.js";


/* harmony default export */ __webpack_exports__["default"] = (function () {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["GlobalLayout"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 11
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Title"], {
    text: "Meander for Practical Data Transformation",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 12
    },
    __self: this
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 13
    },
    __self: this
  }, "As Clojure programmers we love data. We believe that, at its core, programming is just data manipulation. To that end, Clojure provides fantastic data literals for its immutable data structures. Moreover core provides tons of functions for manipulation of data. But as our data grows more complex, things become difficult. Our beautiful declarative data transformation pipeline becomes a nested mess. We wind up, yet again, playing computer in our heads."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 22
    },
    __self: this
  }, "In this tutorial, we are going to build up slowly to understand how ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
    href: "https://github.com/noprompt/meander/",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 23
    },
    __self: this
  }, "Meander"), " ", "can be used to solve practical data transformation problems. We will start with simple examples and move to more complicated ones, hopefully choosing problems that reflect the sorts of menial data transformation tasks we all encounter in our day jobs. Let's start with some vanilla Clojure code."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Clojure"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 29
    },
    __self: this
  }, "\n    (def person\n      {:name \"jimmy\"\n       :preferred-address\n       {:address1 \"123 street ave\"\n        :address2 \"apt 2\"\n        :city \"Townville\"\n        :state \"IN\"\n        :zip \"46203\"}})\n    \n    (defn reformat-preferred-address [person]\n      (let [address (:preferred-address person)]\n        {:address {:line1 (:address1 person)\n                   :line2 (:address2 person)}\n         :city-info {:city (:city address)\n                     :state (:state address)\n                     :zipcode (:zip address)}}))\n    "), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 49
    },
    __self: this
  }, "Here we have a pretty decent Clojure function that converts between two different address formats. This sort of code is fairly common when we need to convert from the data requirements of one system to another. Honestly, with this simple example, the code is fairly straight forward. Our data requirements are simple and so our code isn't difficult. Let's look at how to accomplish this same task in Meander."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Clojure"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 57
    },
    __self: this
  }, "\n    (require '[meander.match.delta :as m])\n    \n    (defn reformat-preferred-address [person]\n      (m/match person\n        {:preferred-address \n         {:address1 ?address1\n          :address2 ?address2\n          :city ?city\n          :state ?state\n          :zip ?zip}}\n        \n        {:address {:line1 ?address1\n                   :line2 ?address2}\n         :city-info {:city ?city\n                     :state ?state\n                     :zipcode ?zip}}))\n    "), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 77
    },
    __self: this
  }, "Here is code that does the same thing written with Meander. One obvious thing to note is that the Meander version is much longer. Judging code based on number of lines is not something we are going to do."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 82
    },
    __self: this
  }, "Let's explain what is going on. First we are using the Meander's", " ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 84
    },
    __self: this
  }, "match"), " feature. ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 84
    },
    __self: this
  }, "match"), " takes the thing that we are matching on (", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 85
    },
    __self: this
  }, "person"), "), a pattern to try to match, and the output. Our pattern here is in the exact shape of the person map we passed in. In order to extract out pieces of this map, we use logic variables (", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 88
    },
    __self: this
  }, "?address1"), ", ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 88
    },
    __self: this
  }, "?address2"), ", etc). Logic variables are just symbols that start with ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 89
    },
    __self: this
  }, "?"), ". We can assign values in our data to any logic variables we'd like and then use those logic variables in our output. One thing I love about this simple Meander example, is that you can see the exact shape of the input immediately."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Heading"], {
    size: "2",
    text: "Making Our Example Harder",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 94
    },
    __self: this
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 95
    },
    __self: this
  }, "This example while somewhat realistic is very limited. While I like the fact that Meander's match shows us the shape of our data, for simple examples like this, Clojure does pretty well. Let's make things harder."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Clojure"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 100
    },
    __self: this
  }, "\n    (def person\n      {:name \"jimmy\"\n       :preferred-address\n       {:address1 \"123 street ave\"\n        :address2 \"apt 2\"\n        :city \"Townville\"\n        :state \"IN\"\n        :zip \"46203\"}\n       :other-addresses \n       [{:address1 \"432 street ave\"\n         :address2 \"apt 7\"\n         :city \"Cityvillage\"\n         :state \"New York\"\n         :zip \"12345\"}\n        {:address1 \"534 street ave\"\n         :address2 \"apt 5\"\n         :city \"Township\"\n         :state \"IN\"\n         :zip \"46203\"}]})\n    "), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 123
    },
    __self: this
  }, "In the example above we left out some things. A person has a preferred address, but they also have other addresses. We have a few different things we want to do with this data. First we want to find all the distinct zip codes that a person has."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Clojure"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 129
    },
    __self: this
  }, "\n    (defn distinct-zip-codes [person]\n      (let [preferred-address-zip (get-in person [:preferred-address :zip])\n            other-zips (map :zip (:other-addresses person))]\n        (distinct (cons preferred-address-zip other-zips))))\n    "), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 137
    },
    __self: this
  }, "Here is some pretty straight forward Clojure code for doing exactly that. I'm sure some people could have minor quibbles about how this is written, but I doubt other solutions would be much different. One thing to note here is that we have lost a little bit the structure of our input data. We could maybe change that up a bit. Maybe using distructuring is the right approach? Regardless, this is a simple and reasonable Clojure function. Now, let's look at the Meander version."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Clojure"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 146
    },
    __self: this
  }, "\n    (defn distinct-zip-codes [person]\n      (m/match person\n        {:preferred-address {:zip !zips}\n         :other-addresses [{:zip !zips} ...]}\n        (distinct !zips)))\n    "), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 155
    },
    __self: this
  }, "Here is the exact same function, but we've introduced two new concepts. The first one is memory variables, in this case ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 157
    },
    __self: this
  }, "!zip"), ". Memory variables start with ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 158
    },
    __self: this
  }, "!"), " and remember all the values they match with. The next concept is the zero or more operator (", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 159
    },
    __self: this
  }, "\u2026"), "). The zero or more operator says to repeat the pattern to its left zero or more times. In this case ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 161
    },
    __self: this
  }, "{:zip !zips}"), ". Using these two, we can declaratively gather up all the zip codes in this data structure."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Heading"], {
    size: "3",
    text: "Minor Modifications",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 164
    },
    __self: this
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 165
    },
    __self: this
  }, "What happens if one of our zip codes is nil? Well for both of our functions, nil gets returned in the output. That is probably not what we want. Let's fix that in both versions."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Clojure"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 170
    },
    __self: this
  }, "\n    (defn distinct-zip-codes [person]\n      (let [preferred-address-zip (get-in person [:preferred-address :zip])\n            other-zips (map :zip (:other-addresses person))]\n        (filter some? (distinct (cons preferred-address-zip other-zips)))))\n    "), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Clojure"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 178
    },
    __self: this
  }, "\n    (defn distinct-zip-codes [person]\n      (m/match person\n        {:preferred-address {:zip (pred some? !zips)}\n         :other-addresses [{:zip (pred some? !zips)} ...]}\n        (distinct !zips)))\n    "), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 187
    },
    __self: this
  }, "These two functions aren't that different. In Meander we could have used", " ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 189
    },
    __self: this
  }, "filter"), " in the exact same way if we wanted. But it's nice that we can set these conditions on the input, which is really more closely stating our intent. Here we used the ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 191
    },
    __self: this
  }, "pred"), " operator which says to match something only if the predicate we give it returns true. Before we move on to more complex examples, let's consider one more modification. This time we want a distinct list of non-nil zips and cities output in a map like this ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 195
    },
    __self: this
  }, "{:zips [] :cities []}"), "."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Clojure"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 197
    },
    __self: this
  }, "\n    (defn distinct-zips-and-cities [person]\n      (let [preferred-address-zip (get-in person [:preferred-address :zip])\n            preferred-address-city (get-in person [:preferred-address :city])\n            other-zips (map :zip (:other-addresses person))\n            other-cities (map :city (:other-addresses person))]\n        {:zips (filter some? (distinct (cons preferred-address-zip other-zips)))\n         :cities (filter some? (distinct (cons preferred-address-city other-cities)))}))\n    "), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Clojure"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 208
    },
    __self: this
  }, "\n    (defn distinct-zips-and-cities [person]\n      (m/match person\n        {:preferred-address {:zip (pred some? !zips)\n                             :city (pred some? !cities)}\n         :other-addresses [{:zip (pred some? !zips)\n                            :city (pred some? !cities)} ...]}\n        {:zips (distinct !zips)\n         :cities (distinct !cities)}))\n    "), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 220
    },
    __self: this
  }, "With both of these examples, I extended them in the most obvious way I could think of. I think the Meander held up pretty well, but I wouldn't have written the plain Clojure function that way. Here's what I probably would have done instead."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Clojure"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 226
    },
    __self: this
  }, "\n    (defn distinct-zips-and-cities [person]\n      (let [addresses (cons (:preferred-address person) \n                            (:other-addresses person))]\n        {:zips (filter some? (distinct (map :zip addresses)))\n         :cities (filter some? (distinct (map :city addresses)))}))\n    "), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 235
    },
    __self: this
  }, "I think this is a pretty good function. But what I find interesting is that I needed to refactor to get here. It took me a little bit to think this way. Ideally, small changes to output should not require us to restructure our code. In this case the change is minor. But if we have to change our structure in such small cases, won't we have to change it even more in larger cases?"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Heading"], {
    size: "2",
    text: "Searching with Meander",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 243
    },
    __self: this
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 244
    },
    __self: this
  }, "All our examples up until this point have had one answer. Yes, that answer might have been a collection, but there was only one way for our pattern to match. This isn't always the case. To see an example of that, let's write some functions using this data structure."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Clojure"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 250
    },
    __self: this
  }, "\n    (def people\n      [{:name \"jimmy\"\n        :addresses [{:address1 \"123 street ave\"\n                     :address2 \"apt 2\"\n                     :city \"Townville\"\n                     :state \"IN\"\n                     :zip \"46203\"\n                     :preferred true}\n                    {:address1 \"534 street ave\",\n                     :address2 \"apt 5\",\n                     :city \"Township\",\n                     :state \"IN\",\n                     :zip \"46203\"\n                     :preferred false}\n                    {:address1 \"543 Other St\",\n                     :address2 \"apt 50\",\n                     :city \"Town\",\n                     :state \"CA\",\n                     :zip \"86753\"\n                     :preferred false}]}\n       {:name \"joel\"\n        :addresses [{:address1 \"2026 park ave\"\n                     :address2 \"apt 200\"\n                     :city \"Town\"\n                     :state \"CA\"\n                     :zip \"86753\"\n                     :preferred true}]}])\n    "), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 281
    },
    __self: this
  }, "I apologize for the amount of room this takes up on the screen, but real world examples are much larger. I want to try and make something that approaches realistic and in order to do that our input needs to be a bit bigger. Okay, so what we want do now is given a zip code, find all people that have an address with that zip code, and for each of the addresses that match that zip code, return a map of", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 288
    },
    __self: this
  }, "{:name <name> :address <address>}"), ". So in this case if we asked for zip ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 289
    },
    __self: this
  }, "86753"), " we should get the following response:"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Clojure"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 291
    },
    __self: this
  }, "\n    ({:name \"jimmy\",\n      :address\n      {:address1 \"543 Other St\",\n       :address2 \"apt 50\",\n       :city \"Town\",\n       :state \"CA\",\n       :zip \"86753\",\n       :preferred false}}\n     {:name \"joel\",\n      :address\n      {:address1 \"2026 park ave\",\n       :address2 \"apt 200\",\n       :city \"Town\",\n       :state \"CA\",\n       :zip \"86753\",\n       :preferred true}})\n    "), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 311
    },
    __self: this
  }, "Okay let's start with the vanilla Clojure example."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Clojure"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 312
    },
    __self: this
  }, "\n    (defn find-people-with-zip [people zip]\n      (for [person people\n            address (:addresses person)\n            :when (= (:zip address) zip)]\n        {:name (:name person)\n         :address address}))\n    "), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 322
    },
    __self: this
  }, "This code might not be very idiomatic. I almost never use ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 323
    },
    __self: this
  }, "for"), " ", "in actual code. But honestly this was the most succinct way I could think to write it. We could also have written something like this:"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Clojure"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 327
    },
    __self: this
  }, "\n    (defn person-with-address-comb [person]\n      (map (fn [address]\n             {:name (:name person)\n              :address address})\n           (:addresses person)))\n    \n    (defn find-people-with-zip [people zip]\n      (->> people\n           (mapcat person-with-address-comb)\n           (filter (comp #{zip} :zip :address))))\n    "), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 341
    },
    __self: this
  }, "It seems like there is a better way I'm overlooking. But regardless I think any of these solutions will be a tiny bit complicated. We've definitely lost the shape of the input data. We have some imperative stuff going on here. Let's contrast this with the Meander implementation."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Clojure"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 347
    },
    __self: this
  }, "\n    (defn find-people-with-zip [people zip]\n      (m/search people\n        (scan {:name ?name\n               :addresses (scan {:zip ~zip :as ?address})})\n        {:name ?name\n         :address ?address}))\n    "), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 357
    },
    __self: this
  }, "This is actually incredibly straight forward even if unfamiliar. We are now using ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 359
    },
    __self: this
  }, "search"), " to find multiple answers. Also note", " ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 360
    },
    __self: this
  }, "~zip"), ". The ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 360
    },
    __self: this
  }, "~"), " here let's us splice in variables that are in scope. And finally, we can name our whole map using the", " ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 362
    },
    __self: this
  }, ":as"), " pattern. This code reads like what we conceptually want to do, scan people's addresses looking for zips that match the one passed in. We do not have to think at all about how this code runs."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Heading"], {
    size: "2",
    text: "One Final Example",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 366
    },
    __self: this
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 367
    },
    __self: this
  }, "For our final example of how Meander can be used to perform data manipulation, will show one feature of logic variables that we have left off so far. To do so we need some more complex data."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Clojure"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 372
    },
    __self: this
  }, "\n    (def data\n      {:people \n       [{:name \"jimmy\" :id 1}\n        {:name \"joel\" :id 2}\n        {:name \"tim\" :id 3}]\n       :addresses\n       {1 [{:address1 \"123 street ave\"\n            :address2 \"apt 2\"\n            :city \"Townville\"\n            :state \"IN\"\n            :zip \"46203\"\n            :preferred true}\n           {:address1 \"534 street ave\",\n            :address2 \"apt 5\",\n            :city \"Township\",\n            :state \"IN\",\n            :zip \"46203\"\n            :preferred false}]\n        2 [{:address1 \"2026 park ave\"\n            :address2 \"apt 200\"\n            :city \"Town\"\n            :state \"CA\"\n            :zip \"86753\"\n            :preferred true}]\n        3 [{:address1 \"1448 street st\"\n            :address2 \"apt 1\"\n            :city \"City\"\n            :state \"WA\"\n            :zip \"92456\"\n            :preferred true}]}\n       :visits {1 [{:date \"12-31-1900\"\n                    :geo-location {:zip \"46203\"}}]\n                2 [{:date \"1-1-1970\"\n                    :geo-location {:zip \"12345\"}}\n                   {:date \"1-1-1970\"\n                    :geo-location {:zip \"86753\"}}]\n                3 [{:date \"4-4-4444\"\n                    :geo-location {:zip \"54221\"}}\n                   {:date \"4-4-4444\"\n                    :geo-location {:zip \"92456\"}}]}})\n    "), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 416
    },
    __self: this
  }, "Here we have some much more realistic data than anything we've seen before. We have a map with three top level keys. These represent data we have gathered from various sources. The first key ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 419
    },
    __self: this
  }, ":people"), " is our collection of people with names and ids. The next are the", " ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 421
    },
    __self: this
  }, ":addresses"), " of these people, indexed by id for efficient lookup. And finally we have ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 422
    },
    __self: this
  }, ":visits"), ", this represents the dates that the users visited our site, again indexed by user-id."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 425
    },
    __self: this
  }, "Here's the mock scenario, we've seen suspicious activity on our site and we aren't quite sure how to narrow it down. We are going to start our investigation by finding any users who had visits that were not in the same zip as their preferred address. Because of the nature of our application, we happen to know that it is typically used at the preferred location. Once we know the users affected, we need to return their name, id, the date of access, and the zip code that didn't match. But I want to show that despite this somewhat complicated scenario, we can easily express this using Meander. Before we get there, the Clojure implementation."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Clojure"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 437
    },
    __self: this
  }, "\n    \n    (defn find-non-matching-visits [address visits]\n      (filter (comp (complement #{(:zip address)}) :zip :geo-location) visits))\n    \n    (defn find-bad-visits-for-person [addresses visits person]\n      (let [preferred-address (first (filter :preferred addresses))\n            non-matching (find-non-matching-visits preferred-address visits)]\n        (map (fn [visit] {:name (:name person)\n                          :id (:id person)\n                          :zip (get-in visit [:geo-location :zip])\n                          :date (:date visit)})\n            non-matching)))\n    \n    (defn find-potential-bad-visits [{:keys [addresses visits people]}]\n      (mapcat (fn [{:keys [id] :as person}] \n                (find-bad-visits-for-person \n                 (addresses id)\n                 (visits id) \n                 person))\n              people))\n    "), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 461
    },
    __self: this
  }, "I really wanted to come up with a better implementation. ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 462
    },
    __self: this
  }, "for"), " ", "might have been useful here. If any reader has a better implementation, I'm happy to replace this one. But honestly, I think no matter version we went with, it is going to have the features that make this one less than desirable. Just look at how much of this code is about telling the computer what to do. Let's look at the Meander version now."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Clojure"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 469
    },
    __self: this
  }, "\n    (defn find-potential-bad-visits [data]\n      (m/search data\n        {:people (scan {:id ?id :name ?name})\n         :addresses {?id (scan {:preferred true :zip ?zip})}\n         :visits {?id (scan {:geo-location {:zip (and (not ?zip) ?bad-zip)}\n                             :date ?date})}}\n        {:name ?name\n         :id ?id\n         :zip ?bad-zip\n         :date ?date}))\n    "), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 483
    },
    __self: this
  }, "This is where Meander shines. ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Term"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 484
    },
    __self: this
  }, "?id"), " is being used to join across data structures. We can now find an id in people and use that to index into other collections. This allows us to find out everything we need to know about a person easily. We can also search into any collection and match on data at any level. We don't need to rely on pulling things out into a higher scope by using let bindings, making helper functions to work on sub collections, or creating a series of transformations to get at the data we care about. Instead we declare our data needs and the relationships that need to hold between them."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_utils_js__WEBPACK_IMPORTED_MODULE_1__["Heading"], {
    size: "2",
    text: "Conclusion",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 494
    },
    __self: this
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 495
    },
    __self: this
  }, "I hope that this has been a good introduction to how Meander can be used for practical data transformation problems. In many of these examples, the vanilla Clojure made for pretty good code. But as the data requirements become more complex, we need tools to handle these. While we may be able to accomplish any of these tasks, the understanding of the structure of our code becomes lost. Looking at the example above, we know so much about what the data coming in looks like. Our code mirrors precisely the shape of data we get in."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 505
    },
    __self: this
  }, "Now I do admit, my examples here are a bit contrived. But they are meant to be simple so we don't focus on the examples and instead focus on the code. In coming posts I will explore more directly various ways we can apply Meander for data transformation. Some ideas I have in mind are using Meander with honeysql to turn our data into sql, transforming a collection of data into hiccup for display as html, and using Meander to scrap the web. I'd also love to do more computer science examples. Using Meander to make little lisp interpreter, a CEK machine or basic arithmetic. And yet, Meander goes way beyond all of these things. Meander is about more than practical data manipulation. It is about a new away of programming, a new way of thinking about problems. Hopefully this introduction will help you to dive in and try it yourself."));
});

/***/ })

})
//# sourceMappingURL=meander-practical.js.f4b10ff69ed0ccce900e.hot-update.js.map