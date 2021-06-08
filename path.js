"use strict";

const E_PARENT_PATH = "E_PARENT_PATH";
let path = require("path");
let Path = {};

Object.keys(path).forEach(function (k) {
  Path[k] = path[k];
});

Path.join = function () {
  let from = arguments[0];
  let result = path.join(...arguments);
  let prefix = path.resolve(from);
  let child = path.resolve(result);
  if (prefix[prefix.length - 1] != "/") {
    prefix += "/";
  }
  if (child[child.length - 1] != "/") {
    child += "/";
  }
  let trunc = (child + "/").slice(0, prefix.length);
  if (".." === result.slice(0, 2) || prefix !== trunc) {
    let err = new Error(
      "'" + result + "' may resolve to a different parent than '" + from + "'"
    );
    err.code = E_PARENT_PATH;
    err.path = result;
    throw err;
  }
  return result;
};

Path.resolve = function () {
  let from = arguments[0];
  let prefix = path.resolve(from);
  let child = path.resolve(...arguments);
  if (prefix[prefix.length - 1] != "/") {
    prefix += "/";
  }
  if (child[child.length - 1] != "/") {
    child += "/";
  }
  let trunc = (child + "/").slice(0, prefix.length);
  if (prefix !== trunc) {
    let err = new Error(
      "'" + child + "' resolves to a different parent than '" + from + "'"
    );
    err.code = E_PARENT_PATH;
    err.path = child;
    throw err;
  }
  return child;
};

Path.relative = function (from, to) {
  let relative = path.relative(from, to);
  if (".." == relative.slice(0, 2)) {
    let err = new Error(
      "'" + relative + "' resolves to a different parent than '" + from + "'"
    );
    err.code = E_PARENT_PATH;
    err.path = relative;
    throw err;
  }
  return relative;
};

Path.promises = {
  join: async function () {
    return Path.join(...arguments);
  },
  resolve: async function () {
    return Path.resolve(...arguments);
  },
  relative: async function (from, to) {
    return Path.relative(from, to);
  },
};

module.exports = Path;
