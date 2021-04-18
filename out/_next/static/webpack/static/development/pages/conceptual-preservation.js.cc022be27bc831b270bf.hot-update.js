webpackHotUpdate("static/development/pages/conceptual-preservation.js",{

/***/ "./utils.js":
/*!******************!*\
  !*** ./utils.js ***!
  \******************/
/*! exports provided: Link, AbsolutePosition, Padding, Margin, detectIndent, removeIndent, formatCode, modifiedSolarizedLight, Code, Javascript, Haskell, Clojure, LargeText, LinkList, Heading, Term, BlockQuote, Title, GlobalLayout */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Link", function() { return Link; });
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


var __jsx = react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement;







var Link = next_link__WEBPACK_IMPORTED_MODULE_5___default.a; // Super ugly hack to override prism languages
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
  return __jsx("div", {
    style: Object(_babel_runtime_corejs2_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])({
      position: "absolute",
      right: right,
      left: left,
      top: top
    }, "left", left),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 33
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
  return __jsx("div", {
    style: {
      paddingTop: top,
      paddingLeft: left,
      paddingRight: right,
      paddingBottom: bottom
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 38
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
  return __jsx("div", {
    style: {
      marginTop: top,
      marginLeft: left,
      marginRight: right,
      marginBottom: bottom
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 48
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
  return __jsx(react_syntax_highlighter_dist_cjs_prism_light__WEBPACK_IMPORTED_MODULE_6___default.a, {
    language: language,
    style: modifiedSolarizedLight,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 97
    },
    __self: this
  }, formatCode(source));
};
var Javascript = function Javascript(_ref6) {
  var children = _ref6.children;
  return __jsx(Code, {
    language: "javascript",
    source: children,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 107
    },
    __self: this
  });
};
var Haskell = function Haskell(_ref7) {
  var children = _ref7.children;
  return __jsx(Code, {
    language: "haskell",
    source: children,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 112
    },
    __self: this
  });
};
var Clojure = function Clojure(_ref8) {
  var children = _ref8.children;
  return __jsx(Code, {
    language: "clojure",
    source: children,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 117
    },
    __self: this
  });
};

var GlobalStyles = function GlobalStyles() {
  return __jsx(styled_jsx_style__WEBPACK_IMPORTED_MODULE_2___default.a, {
    id: "1541984143",
    __self: this
  }, "body{font-family:helvetica,sans-serif;color:#333;line-height:1.5;}a{color:#333;}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qaW1teWhtaWxsZXIvRG9jdW1lbnRzL0NvZGUvamltbXlobWlsbGVyLmdpdGh1Yi5pby91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUEwSEksQUFHMkMsQUFLdkIsV0FDYixzQkFMYSxXQUNLLGdCQUNsQiIsImZpbGUiOiIvVXNlcnMvamltbXlobWlsbGVyL0RvY3VtZW50cy9Db2RlL2ppbW15aG1pbGxlci5naXRodWIuaW8vdXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSGVhZCBmcm9tICduZXh0L2hlYWQnO1xuaW1wb3J0IE5leHRMaW5rIGZyb20gJ25leHQvbGluayc7XG5pbXBvcnQgU3ludGF4SGlnaGxpZ2h0ZXIgZnJvbSBcInJlYWN0LXN5bnRheC1oaWdobGlnaHRlci9kaXN0L2Nqcy9wcmlzbS1saWdodFwiO1xuaW1wb3J0IGpzIGZyb20gJ3JlYWN0LXN5bnRheC1oaWdobGlnaHRlci9kaXN0L2Nqcy9sYW5ndWFnZXMvcHJpc20vamF2YXNjcmlwdCc7XG5pbXBvcnQgaGFza2VsbCBmcm9tICdyZWFjdC1zeW50YXgtaGlnaGxpZ2h0ZXIvZGlzdC9janMvbGFuZ3VhZ2VzL3ByaXNtL2hhc2tlbGwnO1xuaW1wb3J0IGNsb2p1cmUgZnJvbSAncmVhY3Qtc3ludGF4LWhpZ2hsaWdodGVyL2Rpc3QvY2pzL2xhbmd1YWdlcy9wcmlzbS9jbG9qdXJlJztcbmltcG9ydCB7IHNvbGFyaXplZGxpZ2h0IH0gZnJvbSAncmVhY3Qtc3ludGF4LWhpZ2hsaWdodGVyL2Rpc3Qvc3R5bGVzL3ByaXNtJztcblxuZXhwb3J0IGNvbnN0IExpbmsgPSBOZXh0TGluaztcblxuLy8gU3VwZXIgdWdseSBoYWNrIHRvIG92ZXJyaWRlIHByaXNtIGxhbmd1YWdlc1xuLy8gSSByZWFsbHkgc2hvdWxkIG1ha2UgYSBtb2Rlcm4gcHJpc20sIGJ1dCBJIHdpbGxcbi8vIG5ldmVyIGZpbmQgdGltZSB0byBkbyB0aGF0LiBXYXJuaW5nIHRvIGZ1dHVyZSBtZVxuLy8gdGhpcyBjYXVzZXMgc29tZSB3ZWlyZCBzdHVmZiB3aXRoIGhvdCByZWxvYWRpbmcgd2hlbiBjaGFuZ2VkLlxuY29uc3QgY2xvanVyZTIgPSAoUHJpc20pID0+IHtcbiAgY2xvanVyZShQcmlzbSk7XG4gIFByaXNtLmxhbmd1YWdlcy5jbG9qdXJlID0ge1xuICAgIC4uLlByaXNtLmxhbmd1YWdlcy5jbG9qdXJlLFxuICAgIG51bWJlcjogL1xcYi0/KDB4KT9cXGQqXFwuP1xcZCtcXGIvZyxcbiAgICBsb2dpY1ZhcmlhYmxlOiAvKFxcP3whKVthLXpBLVpdW2EtekEtWjAtOS1dKy8sXG4gIH1cbn1cbmNsb2p1cmUyLmRpc3BsYXlOYW1lID0gJ2Nsb2p1cmUnXG5jbG9qdXJlMi5hbGlhc2VzID0gW11cblxuU3ludGF4SGlnaGxpZ2h0ZXIucmVnaXN0ZXJMYW5ndWFnZSgnamF2YXNjcmlwdCcsIGpzKTtcblN5bnRheEhpZ2hsaWdodGVyLnJlZ2lzdGVyTGFuZ3VhZ2UoJ2hhc2tlbGwnLCBoYXNrZWxsKTtcblN5bnRheEhpZ2hsaWdodGVyLnJlZ2lzdGVyTGFuZ3VhZ2UoJ2Nsb2p1cmUnLCBjbG9qdXJlMilcblxuXG5cbmV4cG9ydCBjb25zdCBBYnNvbHV0ZVBvc2l0aW9uID0gKHsgY2hpbGRyZW4sIHJpZ2h0LCB0b3AsIGxlZnQsIGJ1dHRvbX0pID0+XG4gICA8ZGl2IHN0eWxlPXt7IHBvc2l0aW9uOiBcImFic29sdXRlXCIsIHJpZ2h0LCBsZWZ0LCB0b3AsbGVmdH19PlxuICAgICAge2NoaWxkcmVufVxuICAgPC9kaXY+XG5cbmV4cG9ydCBjb25zdCBQYWRkaW5nID0gKHsgY2hpbGRyZW4sIHRvcCwgbGVmdCwgcmlnaHQsIGJvdHRvbSB9KSA9PlxuICAgPGRpdiBzdHlsZT17e1xuICAgICAgcGFkZGluZ1RvcDogdG9wLFxuICAgICAgcGFkZGluZ0xlZnQ6IGxlZnQsXG4gICAgICBwYWRkaW5nUmlnaHQ6IHJpZ2h0LFxuICAgICAgcGFkZGluZ0JvdHRvbTogYm90dG9tLFxuICAgfX0+XG4gICAgICB7Y2hpbGRyZW59XG4gICA8L2Rpdj5cblxuZXhwb3J0IGNvbnN0IE1hcmdpbiA9ICh7IGNoaWxkcmVuLCB0b3AsIGxlZnQsIHJpZ2h0LCBib3R0b20gfSkgPT5cbiAgIDxkaXYgc3R5bGU9e3tcbiAgICAgIG1hcmdpblRvcDogdG9wLFxuICAgICAgbWFyZ2luTGVmdDogbGVmdCxcbiAgICAgIG1hcmdpblJpZ2h0OiByaWdodCxcbiAgICAgIG1hcmdpbkJvdHRvbTogYm90dG9tLFxuICAgfX0+XG4gICAgICB7Y2hpbGRyZW59XG4gICA8L2Rpdj5cblxuY29uc3QgcmVtb3ZlRmlyc3QgPSAoYXJyKSA9PiB7XG4gIGlmIChhcnIubGVuZ3RoID4gMSkge1xuICAgIGFyci5zaGlmdCgpO1xuICB9XG4gIHJldHVybiBhcnI7XG59XG5cbmV4cG9ydCBjb25zdCBkZXRlY3RJbmRlbnQgPSBzb3VyY2UgPT5cbiAgL14gKi8uZXhlYyhzb3VyY2UpWzBdLmxlbmd0aFxuXG5leHBvcnQgY29uc3QgcmVtb3ZlSW5kZW50ID0gKHNvdXJjZSkgPT4gZG8ge1xuICBjb25zdCBsaW5lcyA9IHJlbW92ZUZpcnN0KHNvdXJjZS5zcGxpdChcIlxcblwiKSlcbiAgY29uc3QgaW5kZW50ID0gZGV0ZWN0SW5kZW50KGxpbmVzWzBdKVxuICBsaW5lc1xuICAgIC5tYXAocyA9PiBzLnN1YnN0cmluZyhpbmRlbnQsIHMubGVuZ3RoKSlcbiAgICAuam9pbihcIlxcblwiKVxufVxuXG5cbmV4cG9ydCBjb25zdCBmb3JtYXRDb2RlID0gKHNvdXJjZSkgPT4ge1xuICByZXR1cm4gcmVtb3ZlSW5kZW50KHNvdXJjZSlcbn1cblxuXG5leHBvcnQgY29uc3QgbW9kaWZpZWRTb2xhcml6ZWRMaWdodCA9IHtcbiAgLi4uc29sYXJpemVkbGlnaHQsXG4gIFwib3BlcmF0b3JcIjoge1xuICAgIGNvbG9yOiBcIiNjYjRiMTZcIlxuICB9LFxuICBcImxvZ2ljVmFyaWFibGVcIjoge1xuICAgIGNvbG9yOiBcIiMyYWExOThcIlxuICB9LFxuICBcInByZVtjbGFzcyo9XFxcImxhbmd1YWdlLVxcXCJdXCI6IHtcbiAgICAuLi5zb2xhcml6ZWRsaWdodFtcInByZVtjbGFzcyo9XFxcImxhbmd1YWdlLVxcXCJdXCJdLFxuICAgIGJhY2tncm91bmRDb2xvcjogXCIjZmZmXCIsXG4gIH0sXG59XG5cbmV4cG9ydCBjb25zdCBDb2RlID0gKHsgc291cmNlLCBsYW5ndWFnZSB9KSA9PiB7XG4gIHJldHVybiAoXG4gICAgPFN5bnRheEhpZ2hsaWdodGVyXG4gICAgICBsYW5ndWFnZT17bGFuZ3VhZ2V9XG4gICAgICBzdHlsZT17bW9kaWZpZWRTb2xhcml6ZWRMaWdodH1cbiAgICA+XG4gICAgICB7Zm9ybWF0Q29kZShzb3VyY2UpfVxuICAgIDwvU3ludGF4SGlnaGxpZ2h0ZXI+XG4gIClcbn1cblxuZXhwb3J0IGNvbnN0IEphdmFzY3JpcHQgPSAoeyBjaGlsZHJlbiB9KSA9PiBcbiAgPENvZGVcbiAgICBsYW5ndWFnZT1cImphdmFzY3JpcHRcIlxuICAgIHNvdXJjZT17Y2hpbGRyZW59IC8+XG5cbmV4cG9ydCBjb25zdCBIYXNrZWxsID0gKHsgY2hpbGRyZW4gfSkgPT4gXG4gIDxDb2RlXG4gICAgbGFuZ3VhZ2U9XCJoYXNrZWxsXCJcbiAgICBzb3VyY2U9e2NoaWxkcmVufSAvPlxuXG5leHBvcnQgY29uc3QgQ2xvanVyZSA9ICh7IGNoaWxkcmVuIH0pID0+IFxuICA8Q29kZVxuICAgIGxhbmd1YWdlPVwiY2xvanVyZVwiXG4gICAgc291cmNlPXtjaGlsZHJlbn0gLz5cblxuY29uc3QgR2xvYmFsU3R5bGVzID0gKCkgPT4gXG4gICA8c3R5bGUgZ2xvYmFsIGpzeD5cbiAgIHtgXG4gICAgICBib2R5IHtcbiAgICAgICAgZm9udC1mYW1pbHk6IGhlbHZldGljYSwgc2Fucy1zZXJpZjtcbiAgICAgICAgY29sb3I6ICMzMzM7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiAxLjU7XG4gICAgICB9XG4gICAgICBhIHtcbiAgICAgICAgY29sb3I6ICMzMzM7XG4gICAgICB9XG4gICBgfVxuICAgPC9zdHlsZT5cblxuY29uc3QgQ29udGFpbmVyID0gKHtjaGlsZHJlbn0pID0+XG4gICA8ZGl2IHN0eWxlPXt7XG4gICAgICBtYXJnaW46IFwiMCBhdXRvXCIsXG4gICAgICBtYXhXaWR0aDogNzAwLFxuICAgfX0+XG4gICAgICB7Y2hpbGRyZW59XG4gICA8L2Rpdj5cblxuY29uc3QgTGlzdEl0ZW0gPSAoeyBocmVmLCB0ZXh0LCBFbGVtIH0pID0+XG4gIDxsaSBrZXk9e2hyZWZ9PlxuICAgIDxFbGVtPlxuICAgICAgPExpbmsgaHJlZj17aHJlZn0+XG4gICAgICAgIDxhPnt0ZXh0fTwvYT5cbiAgICAgIDwvTGluaz5cbiAgICA8L0VsZW0+XG4gIDwvbGk+XG5cbmV4cG9ydCBjb25zdCBMYXJnZVRleHQgPSAoeyBjaGlsZHJlbiB9KSA9PiBcbiAgPHAgc3R5bGU9e3tmb250U2l6ZTogXCIxLjVlbVwifX0+XG4gICAge2NoaWxkcmVufVxuICA8L3A+XG5cbmV4cG9ydCBjb25zdCBMaW5rTGlzdCA9ICh7IGl0ZW1zLCBFbGVtPUxhcmdlVGV4dCwgdGl0bGUgfSkgPT5cbiAgPD5cbiAgICA8SGVhZGluZyB0ZXh0PXt0aXRsZX0gLz5cbiAgICA8dWw+XG4gICAgICB7aXRlbXMubWFwKGl0ZW0gPT4gTGlzdEl0ZW0oey4uLml0ZW0sIEVsZW19KSl9XG4gICAgPC91bD5cbiAgPC8+XG5cbmV4cG9ydCBjb25zdCBIZWFkaW5nID0gKHsgY29sb3IsIHRleHQsIHNpemU9MSB9KSA9PiBkbyB7XG4gIGNvbnN0IHNpemVUb0VsZW0gPSB7MTogXCJoMVwiLCAyOiBcImgyXCIsIDM6IFwiaDNcIiwgXCI0XCI6IFwiaDRcIn1cbiAgY29uc3QgRWxlbSA9IHNpemVUb0VsZW1bc2l6ZV07XG4gIDxFbGVtIHN0eWxlPXt7IGNvbG9yIH19PlxuICAgIHt0ZXh0fVxuICA8L0VsZW0+XG59XG5cbmV4cG9ydCBjb25zdCBUZXJtID0gKHtjaGlsZHJlbn0pID0+XG4gIDxjb2RlIHN0eWxlPXt7XG4gICAgYmFja2dyb3VuZENvbG9yOiBcInJnYmEoMjcsMzEsMzUsMC4wNSlcIixcbiAgICBwYWRkaW5nOiBcIjAuMmVtIDAuNGVtXCIsXG4gICAgYm9yZGVyUmFkaXVzOiAzLFxuICAgIGZvbnRGYW1pbHk6IFwiTW9uYWNvLCBtb25vc3BhY2VcIixcbiAgICBmb250U2l6ZTogMTMsXG4gICAgd2hpdGVTcGFjZTogXCJub3dyYXBcIixcbiAgfX0+XG4gICAge2NoaWxkcmVufVxuICA8L2NvZGU+XG5cbmV4cG9ydCBjb25zdCBCbG9ja1F1b3RlID0gKHtjaGlsZHJlbn0pID0+XG4gIDxibG9ja3F1b3RlIHN0eWxlPXt7XG4gICAgcGFkZGluZ0xlZnQ6IDIwLFxuICAgIG1hcmdpbjogMCxcbiAgICBtYXJnaW5MZWZ0OiAyMCxcbiAgICBib3JkZXJMZWZ0OiBcIjAuMjVlbSBzb2xpZCAjZGZlMmU1XCIsXG4gIH19PlxuICAgIHtjaGlsZHJlbn1cbiAgPC9ibG9ja3F1b3RlPlxuXG5leHBvcnQgY29uc3QgVGl0bGUgPSAoeyB0ZXh0IH0pID0+IFxuICA8PlxuICAgIDxIZWFkPlxuICAgICAgPHRpdGxlPnt0ZXh0fTwvdGl0bGU+XG4gICAgPC9IZWFkPlxuICAgIDxIZWFkaW5nIHRleHQ9e3RleHR9IHNpemU9ezF9IC8+XG4gIDwvPlxuXG5leHBvcnQgY29uc3QgR2xvYmFsTGF5b3V0ID0gKHsgY2hpbGRyZW4gfSkgPT5cbiAgPD5cbiAgICA8SGVhZD5cbiAgICAgIDxtZXRhIG5hbWU9XCJ2aWV3cG9ydFwiIGNvbnRlbnQ9XCJ3aWR0aD1kZXZpY2Utd2lkdGgsIGluaXRpYWwtc2NhbGU9MVwiIC8+XG4gICAgICA8bGluayByZWw9XCJpY29uXCIgaHJlZj1cImRhdGE6O2Jhc2U2NCxpVkJPUncwS0dnbz1cIiAvPlxuICAgICAgPG1ldGEgbmFtZT1cImF1dGhvclwiIGNvbnRlbnQ9XCJKaW1teSBNaWxsZXJcIiAvPlxuICAgICAgPGxpbmsgcmVsPVwiYWx0ZXJuYXRlXCIgdHlwZT1cImFwcGxpY2F0aW9uL3Jzcyt4bWxcIiB0aXRsZT1cImppbW15aG1pbGxlci5naXRodWIuaW9cIiAgaHJlZj1cIi9zdGF0aWMvZmVlZC54bWxcIiAvPlxuICAgIDwvSGVhZD5cbiAgICA8R2xvYmFsU3R5bGVzIC8+XG4gICAgPENvbnRhaW5lcj5cbiAgICAgIDxkaXYgc3R5bGU9e3twb3NpdGlvbjogXCJyZWxhdGl2ZVwifX0+XG4gICAgICAgICAgPEFic29sdXRlUG9zaXRpb24gcmlnaHQ9ezB9IHRvcD17MH0+XG4gICAgICAgICAgPExpbmsgaHJlZj1cIi9cIj5cbiAgICAgICAgICAgIDxhIHN0eWxlPXt7dGV4dERlY29yYXRpb246IFwibm9uZVwifX0+XG4gICAgICAgICAgICAgIDxIZWFkaW5nXG4gICAgICAgICAgICAgICAgIGNvbG9yPVwiIzk5OVwiXG4gICAgICAgICAgICAgICAgIHRleHQ9XCJKaW1teSBNaWxsZXJcIi8+XG4gICAgICAgICAgICA8L2E+XG4gICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICA8L0Fic29sdXRlUG9zaXRpb24+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxQYWRkaW5nIHRvcD17NzB9PlxuICAgICAgICB7Y2hpbGRyZW59XG4gICAgICA8L1BhZGRpbmc+XG4gICAgPC9Db250YWluZXI+XG4gIDwvPlxuXG5cbiJdfQ== */\n/*@ sourceURL=/Users/jimmyhmiller/Documents/Code/jimmyhmiller.github.io/utils.js */");
};

var Container = function Container(_ref9) {
  var children = _ref9.children;
  return __jsx("div", {
    style: {
      margin: "0 auto",
      maxWidth: 700
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 136
    },
    __self: this
  }, children);
};

var ListItem = function ListItem(_ref10) {
  var href = _ref10.href,
      text = _ref10.text,
      Elem = _ref10.Elem;
  return __jsx("li", {
    key: href,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 144
    },
    __self: this
  }, __jsx(Elem, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 145
    },
    __self: this
  }, __jsx(Link, {
    href: href,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 146
    },
    __self: this
  }, __jsx("a", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 147
    },
    __self: this
  }, text))));
};

var LargeText = function LargeText(_ref11) {
  var children = _ref11.children;
  return __jsx("p", {
    style: {
      fontSize: "1.5em"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 153
    },
    __self: this
  }, children);
};
var LinkList = function LinkList(_ref12) {
  var items = _ref12.items,
      _ref12$Elem = _ref12.Elem,
      Elem = _ref12$Elem === void 0 ? LargeText : _ref12$Elem,
      title = _ref12.title;
  return __jsx(react__WEBPACK_IMPORTED_MODULE_3___default.a.Fragment, null, __jsx(Heading, {
    text: title,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 159
    },
    __self: this
  }), __jsx("ul", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 160
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
  }, Elem = sizeToElem[size], __jsx(Elem, {
    style: {
      color: color
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 168
    },
    __self: this
  }, text);
};
var Term = function Term(_ref14) {
  var children = _ref14.children;
  return __jsx("code", {
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
      lineNumber: 174
    },
    __self: this
  }, children);
};
var BlockQuote = function BlockQuote(_ref15) {
  var children = _ref15.children;
  return __jsx("blockquote", {
    style: {
      paddingLeft: 20,
      margin: 0,
      marginLeft: 20,
      borderLeft: "0.25em solid #dfe2e5"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 186
    },
    __self: this
  }, children);
};
var Title = function Title(_ref16) {
  var text = _ref16.text;
  return __jsx(react__WEBPACK_IMPORTED_MODULE_3___default.a.Fragment, null, __jsx(next_head__WEBPACK_IMPORTED_MODULE_4___default.a, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 197
    },
    __self: this
  }, __jsx("title", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 198
    },
    __self: this
  }, text)), __jsx(Heading, {
    text: text,
    size: 1,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 200
    },
    __self: this
  }));
};
var GlobalLayout = function GlobalLayout(_ref17) {
  var children = _ref17.children;
  return __jsx(react__WEBPACK_IMPORTED_MODULE_3___default.a.Fragment, null, __jsx(next_head__WEBPACK_IMPORTED_MODULE_4___default.a, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 205
    },
    __self: this
  }, __jsx("meta", {
    name: "viewport",
    content: "width=device-width, initial-scale=1",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 206
    },
    __self: this
  }), __jsx("link", {
    rel: "icon",
    href: "data:;base64,iVBORw0KGgo=",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 207
    },
    __self: this
  }), __jsx("meta", {
    name: "author",
    content: "Jimmy Miller",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 208
    },
    __self: this
  }), __jsx("link", {
    rel: "alternate",
    type: "application/rss+xml",
    title: "jimmyhmiller.github.io",
    href: "/static/feed.xml",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 209
    },
    __self: this
  })), __jsx(GlobalStyles, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 211
    },
    __self: this
  }), __jsx(Container, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 212
    },
    __self: this
  }, __jsx("div", {
    style: {
      position: "relative"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 213
    },
    __self: this
  }, __jsx(AbsolutePosition, {
    right: 0,
    top: 0,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 214
    },
    __self: this
  }, __jsx(Link, {
    href: "/",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 215
    },
    __self: this
  }, __jsx("a", {
    style: {
      textDecoration: "none"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 216
    },
    __self: this
  }, __jsx(Heading, {
    color: "#999",
    text: "Jimmy Miller",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 217
    },
    __self: this
  }))))), __jsx(Padding, {
    top: 70,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 224
    },
    __self: this
  }, children)));
};

/***/ })

})
//# sourceMappingURL=conceptual-preservation.js.cc022be27bc831b270bf.hot-update.js.map