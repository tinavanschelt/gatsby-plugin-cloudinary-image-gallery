"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

function PhotoSwipeDOM() {
  return _react.default.createElement("div", {
    className: "pswp",
    tabIndex: "-1",
    role: "dialog",
    "aria-hidden": "true"
  }, _react.default.createElement("div", {
    className: "pswp__bg"
  }), _react.default.createElement("div", {
    className: "pswp__scroll-wrap"
  }, _react.default.createElement("div", {
    className: "pswp__container"
  }, _react.default.createElement("div", {
    className: "pswp__item"
  }), _react.default.createElement("div", {
    className: "pswp__item"
  }), _react.default.createElement("div", {
    className: "pswp__item"
  })), _react.default.createElement("div", {
    className: "pswp__ui pswp__ui--hidden"
  }, _react.default.createElement("div", {
    className: "pswp__top-bar"
  }, _react.default.createElement("div", {
    className: "pswp__counter"
  }), _react.default.createElement("button", {
    className: "pswp__button pswp__button--close",
    title: "Close (Esc)"
  }), _react.default.createElement("button", {
    className: "pswp__button pswp__button--share",
    title: "Share"
  }), _react.default.createElement("button", {
    className: "pswp__button pswp__button--fs",
    title: "Toggle fullscreen"
  }), _react.default.createElement("button", {
    className: "pswp__button pswp__button--zoom",
    title: "Zoom in/out"
  }), _react.default.createElement("div", {
    className: "pswp__preloader"
  }, _react.default.createElement("div", {
    className: "pswp__preloader__icn"
  }, _react.default.createElement("div", {
    className: "pswp__preloader__cut"
  }, _react.default.createElement("div", {
    className: "pswp__preloader__donut"
  }))))), _react.default.createElement("div", {
    className: "pswp__share-modal pswp__share-modal--hidden pswp__single-tap"
  }, _react.default.createElement("div", {
    className: "pswp__share-tooltip"
  })), _react.default.createElement("button", {
    className: "pswp__button pswp__button--arrow--left",
    title: "Previous (arrow left)"
  }), _react.default.createElement("button", {
    className: "pswp__button pswp__button--arrow--right",
    title: "Next (arrow right)"
  }), _react.default.createElement("div", {
    className: "pswp__caption"
  }, _react.default.createElement("div", {
    className: "pswp__caption__center"
  })))));
}

var _default = PhotoSwipeDOM;
exports.default = _default;