webpackHotUpdate("static/development/pages/meander-practical.js",{

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
  }, "body{font-family:helvetica,sans-serif;color:#333;line-height:1.5;}a{color:#333;}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qaW1teWhtaWxsZXIvRG9jdW1lbnRzL0NvZGUvamltbXlobWlsbGVyLmdpdGh1Yi5pby91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUF3SEksQUFHMkMsQUFLdkIsV0FDYixzQkFMYSxXQUNLLGdCQUNsQiIsImZpbGUiOiIvVXNlcnMvamltbXlobWlsbGVyL0RvY3VtZW50cy9Db2RlL2ppbW15aG1pbGxlci5naXRodWIuaW8vdXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSGVhZCBmcm9tICduZXh0L2hlYWQnO1xuaW1wb3J0IExpbmsgZnJvbSAnbmV4dC9saW5rJztcbmltcG9ydCBTeW50YXhIaWdobGlnaHRlciBmcm9tIFwicmVhY3Qtc3ludGF4LWhpZ2hsaWdodGVyL2Rpc3QvY2pzL3ByaXNtLWxpZ2h0XCI7XG5pbXBvcnQganMgZnJvbSAncmVhY3Qtc3ludGF4LWhpZ2hsaWdodGVyL2Rpc3QvY2pzL2xhbmd1YWdlcy9wcmlzbS9qYXZhc2NyaXB0JztcbmltcG9ydCBoYXNrZWxsIGZyb20gJ3JlYWN0LXN5bnRheC1oaWdobGlnaHRlci9kaXN0L2Nqcy9sYW5ndWFnZXMvcHJpc20vaGFza2VsbCc7XG5pbXBvcnQgY2xvanVyZSBmcm9tICdyZWFjdC1zeW50YXgtaGlnaGxpZ2h0ZXIvZGlzdC9janMvbGFuZ3VhZ2VzL3ByaXNtL2Nsb2p1cmUnO1xuaW1wb3J0IHsgc29sYXJpemVkbGlnaHQgfSBmcm9tICdyZWFjdC1zeW50YXgtaGlnaGxpZ2h0ZXIvZGlzdC9zdHlsZXMvcHJpc20nO1xuXG4vLyBTdXBlciB1Z2x5IGhhY2sgdG8gb3ZlcnJpZGUgcHJpc20gbGFuZ3VhZ2VzXG4vLyBJIHJlYWxseSBzaG91bGQgbWFrZSBhIG1vZGVybiBwcmlzbSwgYnV0IEkgd2lsbFxuLy8gbmV2ZXIgZmluZCB0aW1lIHRvIGRvIHRoYXQuIFdhcm5pbmcgdG8gZnV0dXJlIG1lXG4vLyB0aGlzIGNhdXNlcyBzb21lIHdlaXJkIHN0dWZmIHdpdGggaG90IHJlbG9hZGluZyB3aGVuIGNoYW5nZWQuXG5jb25zdCBjbG9qdXJlMiA9IChQcmlzbSkgPT4ge1xuICBjbG9qdXJlKFByaXNtKTtcbiAgUHJpc20ubGFuZ3VhZ2VzLmNsb2p1cmUgPSB7XG4gICAgLi4uUHJpc20ubGFuZ3VhZ2VzLmNsb2p1cmUsXG4gICAgbnVtYmVyOiAvXFxiLT8oMHgpP1xcZCpcXC4/XFxkK1xcYi9nLFxuICAgIGxvZ2ljVmFyaWFibGU6IC8oXFw/fCEpW2EtekEtWl1bYS16QS1aMC05LV0rLyxcbiAgfVxufVxuY2xvanVyZTIuZGlzcGxheU5hbWUgPSAnY2xvanVyZSdcbmNsb2p1cmUyLmFsaWFzZXMgPSBbXVxuXG5TeW50YXhIaWdobGlnaHRlci5yZWdpc3Rlckxhbmd1YWdlKCdqYXZhc2NyaXB0JywganMpO1xuU3ludGF4SGlnaGxpZ2h0ZXIucmVnaXN0ZXJMYW5ndWFnZSgnaGFza2VsbCcsIGhhc2tlbGwpO1xuU3ludGF4SGlnaGxpZ2h0ZXIucmVnaXN0ZXJMYW5ndWFnZSgnY2xvanVyZScsIGNsb2p1cmUyKVxuXG5cblxuZXhwb3J0IGNvbnN0IEFic29sdXRlUG9zaXRpb24gPSAoeyBjaGlsZHJlbiwgcmlnaHQsIHRvcCwgbGVmdCwgYnV0dG9tfSkgPT5cbiAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246IFwiYWJzb2x1dGVcIiwgcmlnaHQsIGxlZnQsIHRvcCxsZWZ0fX0+XG4gICAgICB7Y2hpbGRyZW59XG4gICA8L2Rpdj5cblxuZXhwb3J0IGNvbnN0IFBhZGRpbmcgPSAoeyBjaGlsZHJlbiwgdG9wLCBsZWZ0LCByaWdodCwgYm90dG9tIH0pID0+XG4gICA8ZGl2IHN0eWxlPXt7XG4gICAgICBwYWRkaW5nVG9wOiB0b3AsXG4gICAgICBwYWRkaW5nTGVmdDogbGVmdCxcbiAgICAgIHBhZGRpbmdSaWdodDogcmlnaHQsXG4gICAgICBwYWRkaW5nQm90dG9tOiBib3R0b20sXG4gICB9fT5cbiAgICAgIHtjaGlsZHJlbn1cbiAgIDwvZGl2PlxuXG5leHBvcnQgY29uc3QgTWFyZ2luID0gKHsgY2hpbGRyZW4sIHRvcCwgbGVmdCwgcmlnaHQsIGJvdHRvbSB9KSA9PlxuICAgPGRpdiBzdHlsZT17e1xuICAgICAgbWFyZ2luVG9wOiB0b3AsXG4gICAgICBtYXJnaW5MZWZ0OiBsZWZ0LFxuICAgICAgbWFyZ2luUmlnaHQ6IHJpZ2h0LFxuICAgICAgbWFyZ2luQm90dG9tOiBib3R0b20sXG4gICB9fT5cbiAgICAgIHtjaGlsZHJlbn1cbiAgIDwvZGl2PlxuXG5jb25zdCByZW1vdmVGaXJzdCA9IChhcnIpID0+IHtcbiAgaWYgKGFyci5sZW5ndGggPiAxKSB7XG4gICAgYXJyLnNoaWZ0KCk7XG4gIH1cbiAgcmV0dXJuIGFycjtcbn1cblxuZXhwb3J0IGNvbnN0IGRldGVjdEluZGVudCA9IHNvdXJjZSA9PlxuICAvXiAqLy5leGVjKHNvdXJjZSlbMF0ubGVuZ3RoXG5cbmV4cG9ydCBjb25zdCByZW1vdmVJbmRlbnQgPSAoc291cmNlKSA9PiBkbyB7XG4gIGNvbnN0IGxpbmVzID0gcmVtb3ZlRmlyc3Qoc291cmNlLnNwbGl0KFwiXFxuXCIpKVxuICBjb25zdCBpbmRlbnQgPSBkZXRlY3RJbmRlbnQobGluZXNbMF0pXG4gIGxpbmVzXG4gICAgLm1hcChzID0+IHMuc3Vic3RyaW5nKGluZGVudCwgcy5sZW5ndGgpKVxuICAgIC5qb2luKFwiXFxuXCIpXG59XG5cblxuZXhwb3J0IGNvbnN0IGZvcm1hdENvZGUgPSAoc291cmNlKSA9PiB7XG4gIHJldHVybiByZW1vdmVJbmRlbnQoc291cmNlKVxufVxuXG5cbmV4cG9ydCBjb25zdCBtb2RpZmllZFNvbGFyaXplZExpZ2h0ID0ge1xuICAuLi5zb2xhcml6ZWRsaWdodCxcbiAgXCJvcGVyYXRvclwiOiB7XG4gICAgY29sb3I6IFwiI2NiNGIxNlwiXG4gIH0sXG4gIFwibG9naWNWYXJpYWJsZVwiOiB7XG4gICAgY29sb3I6IFwiIzJhYTE5OFwiXG4gIH0sXG4gIFwicHJlW2NsYXNzKj1cXFwibGFuZ3VhZ2UtXFxcIl1cIjoge1xuICAgIC4uLnNvbGFyaXplZGxpZ2h0W1wicHJlW2NsYXNzKj1cXFwibGFuZ3VhZ2UtXFxcIl1cIl0sXG4gICAgYmFja2dyb3VuZENvbG9yOiBcIiNmZmZcIixcbiAgfSxcbn1cblxuZXhwb3J0IGNvbnN0IENvZGUgPSAoeyBzb3VyY2UsIGxhbmd1YWdlIH0pID0+IHtcbiAgcmV0dXJuIChcbiAgICA8U3ludGF4SGlnaGxpZ2h0ZXJcbiAgICAgIGxhbmd1YWdlPXtsYW5ndWFnZX1cbiAgICAgIHN0eWxlPXttb2RpZmllZFNvbGFyaXplZExpZ2h0fVxuICAgID5cbiAgICAgIHtmb3JtYXRDb2RlKHNvdXJjZSl9XG4gICAgPC9TeW50YXhIaWdobGlnaHRlcj5cbiAgKVxufVxuXG5leHBvcnQgY29uc3QgSmF2YXNjcmlwdCA9ICh7IGNoaWxkcmVuIH0pID0+IFxuICA8Q29kZVxuICAgIGxhbmd1YWdlPVwiamF2YXNjcmlwdFwiXG4gICAgc291cmNlPXtjaGlsZHJlbn0gLz5cblxuZXhwb3J0IGNvbnN0IEhhc2tlbGwgPSAoeyBjaGlsZHJlbiB9KSA9PiBcbiAgPENvZGVcbiAgICBsYW5ndWFnZT1cImhhc2tlbGxcIlxuICAgIHNvdXJjZT17Y2hpbGRyZW59IC8+XG5cbmV4cG9ydCBjb25zdCBDbG9qdXJlID0gKHsgY2hpbGRyZW4gfSkgPT4gXG4gIDxDb2RlXG4gICAgbGFuZ3VhZ2U9XCJjbG9qdXJlXCJcbiAgICBzb3VyY2U9e2NoaWxkcmVufSAvPlxuXG5jb25zdCBHbG9iYWxTdHlsZXMgPSAoKSA9PiBcbiAgIDxzdHlsZSBnbG9iYWwganN4PlxuICAge2BcbiAgICAgIGJvZHkge1xuICAgICAgICBmb250LWZhbWlseTogaGVsdmV0aWNhLCBzYW5zLXNlcmlmO1xuICAgICAgICBjb2xvcjogIzMzMztcbiAgICAgICAgbGluZS1oZWlnaHQ6IDEuNTtcbiAgICAgIH1cbiAgICAgIGEge1xuICAgICAgICBjb2xvcjogIzMzMztcbiAgICAgIH1cbiAgIGB9XG4gICA8L3N0eWxlPlxuXG5jb25zdCBDb250YWluZXIgPSAoe2NoaWxkcmVufSkgPT5cbiAgIDxkaXYgc3R5bGU9e3tcbiAgICAgIG1hcmdpbjogXCIwIGF1dG9cIixcbiAgICAgIG1heFdpZHRoOiA3MDAsXG4gICB9fT5cbiAgICAgIHtjaGlsZHJlbn1cbiAgIDwvZGl2PlxuXG5jb25zdCBMaXN0SXRlbSA9ICh7IGhyZWYsIHRleHQsIEVsZW0gfSkgPT5cbiAgPGxpIGtleT17aHJlZn0+XG4gICAgPEVsZW0+XG4gICAgICA8TGluayBocmVmPXtocmVmfSBhcz17aHJlZiArIFwiL1wifT5cbiAgICAgICAgPGE+e3RleHR9PC9hPlxuICAgICAgPC9MaW5rPlxuICAgIDwvRWxlbT5cbiAgPC9saT5cblxuZXhwb3J0IGNvbnN0IExhcmdlVGV4dCA9ICh7IGNoaWxkcmVuIH0pID0+IFxuICA8cCBzdHlsZT17e2ZvbnRTaXplOiBcIjEuNWVtXCJ9fT5cbiAgICB7Y2hpbGRyZW59XG4gIDwvcD5cblxuZXhwb3J0IGNvbnN0IExpbmtMaXN0ID0gKHsgaXRlbXMsIEVsZW09TGFyZ2VUZXh0LCB0aXRsZSB9KSA9PlxuICA8PlxuICAgIDxIZWFkaW5nIHRleHQ9e3RpdGxlfSAvPlxuICAgIDx1bD5cbiAgICAgIHtpdGVtcy5tYXAoaXRlbSA9PiBMaXN0SXRlbSh7Li4uaXRlbSwgRWxlbX0pKX1cbiAgICA8L3VsPlxuICA8Lz5cblxuZXhwb3J0IGNvbnN0IEhlYWRpbmcgPSAoeyBjb2xvciwgdGV4dCwgc2l6ZT0xIH0pID0+IGRvIHtcbiAgY29uc3Qgc2l6ZVRvRWxlbSA9IHsxOiBcImgxXCIsIDI6IFwiaDJcIiwgMzogXCJoM1wiLCBcIjRcIjogXCJoNFwifVxuICBjb25zdCBFbGVtID0gc2l6ZVRvRWxlbVtzaXplXTtcbiAgPEVsZW0gc3R5bGU9e3sgY29sb3IgfX0+XG4gICAge3RleHR9XG4gIDwvRWxlbT5cbn1cblxuZXhwb3J0IGNvbnN0IFRlcm0gPSAoe2NoaWxkcmVufSkgPT5cbiAgPGNvZGUgc3R5bGU9e3tcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IFwicmdiYSgyNywzMSwzNSwwLjA1KVwiLFxuICAgIHBhZGRpbmc6IFwiMC4yZW0gMC40ZW1cIixcbiAgICBib3JkZXJSYWRpdXM6IDMsXG4gICAgZm9udEZhbWlseTogXCJNb25hY28sIG1vbm9zcGFjZVwiLFxuICAgIGZvbnRTaXplOiAxMyxcbiAgICB3aGl0ZVNwYWNlOiBcIm5vd3JhcFwiLFxuICB9fT5cbiAgICB7Y2hpbGRyZW59XG4gIDwvY29kZT5cblxuZXhwb3J0IGNvbnN0IEJsb2NrUXVvdGUgPSAoe2NoaWxkcmVufSkgPT5cbiAgPGJsb2NrcXVvdGUgc3R5bGU9e3tcbiAgICBwYWRkaW5nTGVmdDogMjAsXG4gICAgbWFyZ2luOiAwLFxuICAgIG1hcmdpbkxlZnQ6IDIwLFxuICAgIGJvcmRlckxlZnQ6IFwiMC4yNWVtIHNvbGlkICNkZmUyZTVcIixcbiAgfX0+XG4gICAge2NoaWxkcmVufVxuICA8L2Jsb2NrcXVvdGU+XG5cbmV4cG9ydCBjb25zdCBUaXRsZSA9ICh7IHRleHQgfSkgPT4gXG4gIDw+XG4gICAgPEhlYWQ+XG4gICAgICA8dGl0bGU+e3RleHR9PC90aXRsZT5cbiAgICA8L0hlYWQ+XG4gICAgPEhlYWRpbmcgdGV4dD17dGV4dH0gc2l6ZT17MX0gLz5cbiAgPC8+XG5cblxuZXhwb3J0IGNvbnN0IEdsb2JhbExheW91dCA9ICh7IGNoaWxkcmVuIH0pID0+XG4gIDw+XG4gICAgPEhlYWQ+XG4gICAgICA8bWV0YSBuYW1lPVwidmlld3BvcnRcIiBjb250ZW50PVwid2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTFcIiAvPlxuICAgICAgPGxpbmsgcmVsPVwiaWNvblwiIGhyZWY9XCJkYXRhOjtiYXNlNjQsaVZCT1J3MEtHZ289XCIgLz5cbiAgICAgIDxtZXRhIG5hbWU9XCJhdXRob3JcIiBjb250ZW50PVwiSmltbXkgTWlsbGVyXCIgLz5cbiAgICA8L0hlYWQ+XG4gICAgPEdsb2JhbFN0eWxlcyAvPlxuICAgIDxDb250YWluZXI+XG4gICAgICA8ZGl2IHN0eWxlPXt7cG9zaXRpb246IFwicmVsYXRpdmVcIn19PlxuICAgICAgICAgIDxBYnNvbHV0ZVBvc2l0aW9uIHJpZ2h0PXswfSB0b3A9ezB9PlxuICAgICAgICAgIDxhIGhyZWY9XCIvXCIgc3R5bGU9e3t0ZXh0RGVjb3JhdGlvbjogXCJub25lXCJ9fT5cbiAgICAgICAgICAgIDxIZWFkaW5nXG4gICAgICAgICAgICAgICBjb2xvcj1cIiM5OTlcIlxuICAgICAgICAgICAgICAgdGV4dD1cIkppbW15IE1pbGxlclwiLz5cbiAgICAgICAgICA8L2E+XG4gICAgICAgICAgPC9BYnNvbHV0ZVBvc2l0aW9uPlxuICAgICAgPC9kaXY+XG4gICAgICA8UGFkZGluZyB0b3A9ezcwfT5cbiAgICAgICAge2NoaWxkcmVufVxuICAgICAgPC9QYWRkaW5nPlxuICAgIDwvQ29udGFpbmVyPlxuICA8Lz5cblxuXG4iXX0= */\n/*@ sourceURL=/Users/jimmyhmiller/Documents/Code/jimmyhmiller.github.io/utils.js */");
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
  }, react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement("a", {
    href: "/",
    style: {
      textDecoration: "none"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 213
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(Heading, {
    color: "#999",
    text: "Jimmy Miller",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 214
    },
    __self: this
  })))), react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(Padding, {
    top: 70,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 220
    },
    __self: this
  }, children)));
};

/***/ })

})
//# sourceMappingURL=meander-practical.js.9b1ded2dadafdbdacaee.hot-update.js.map