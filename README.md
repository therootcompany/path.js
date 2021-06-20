# [@root/path](https://github.com/therootcompany/path.js)

A secure-by-default path module (wrapper around node's path).

```bash
npm install --save @root/path
```

[![@root-path-thumbnail](https://user-images.githubusercontent.com/122831/122685243-736aac80-d1c7-11eb-81e4-157e58e9f172.jpeg)](https://youtu.be/7JeejK8EDCk)

```js
var Path = require("@root/path");

// throws error when path resolves to ../...
Path.join("foo", "../bar"); // throws error
Path.resolve("/foo", "/bar"); // throws error
Path.relative("/foo/bar", "/foo"); // throws error

// unsafe is an alias to require('path'), for convenience;
Path.unsafe.join("foo", "../bar"); // does NOT throw error
```

Use with Promises, if you prefer: \
(not actually async, but makes error handling easier via `.catch()`):

```js
var Path = require("@root/path").promises;

Path.join("foo", "../bar").catch(function (e) {
  // give empty string rather than throwing error
  return "";
});

await Path.unsafe.join("foo", "../bar");
```

Note: v1.x does _not_ check `fs.realpath` to resolve symbolic links. You
probably know if you're using symbolic links, so if you're using potentially
dangerous symbolic links, you need to check `fs.realpath` yourself.

# API

Same as the built-in [`path`](https://nodejs.org/api/path.html), but throws an
error when a `join`ed, `resolve`d, or `relative` path is not a child of the
`root`, `base`, or `from` path.

```json
{
  "message": "'x' [may] resolve[s] to a different parent than 'y'",
  "code": "E_PARENT_PATH",
  "path": "x"
}
```

## Path.join(root, child1, ...)

Throw an error if the new path is not a child of `root`:

```js
// Good
Path.join("/foo", "/bar"); //=> /foo/bar
Path.join("/foo", "./bar"); //=> /foo/bar
Path.join("/foo", "bar"); //=> /foo/bar
Path.join("foo", "bar"); //=> foo/bar

// Bad
Path.join("../foo", "bar"); //X ../foo/bar
Path.join("foo", "../bar"); //X ./bar
```

## Path.resolve(base, path1, ...)

Throw an error if the new path is is not a child of `base`:

```js
// Good
Path.resolve("/foo", "./bar"); //=> /foo/bar
Path.resolve("/foo", "bar"); //=> /foo/bar
Path.resolve("foo", "bar"); //=> /Users/me/foo/bar
Path.resolve("../foo", "bar"); // /Users/foo/bar

// Bad
Path.resolve("/foo", "/bar"); //X /bar
Path.resolve("foo", "../bar"); //X /Users/me/bar
```

## Path.relative(from, to)

Throw an error if `to` resolves outside of `from` (i.e. the path starts with
`..`):

```js
// Good
Path.relative("/foo/bar", "/foo/bar/baz"); //=> bar
Path.relative("/foo", "/foo/bar/baz"); //=> bar/baz
Path.relative("foo", "foo/bar"); //=> bar

// Bad
Path.relative("foo", "bar"); //X ../bar
Path.relative("/foo", "bar"); //X ../Users/me/bar
Path.relative("/foo/bar", "/foo"); //X ..
Path.relative("../foo", "bar"); // //X ../me/bar
```

## Extra

The rest of `path`'s properties are provided for convenience, but their behavior
is left unchanged.

See <https://nodejs.org/api/path.html>

- [Path.basename(path[, ext])](https://nodejs.org/api/path.html#path_path_basename_path_ext)
- [Path.delimiter](https://nodejs.org/api/path.html#path_path_delimiter)
- [Path.dirname(path)](https://nodejs.org/api/path.html#path_path_dirname_path)
- [Path.extname(path)](https://nodejs.org/api/path.html#path_path_extname_path)
- [Path.format(pathObject)](https://nodejs.org/api/path.html#path_path_format_pathobject)
- [Path.isAbsolute(path)](https://nodejs.org/api/path.html#path_path_isabsolute_path)
- Path.join([...paths]) (see above)
- [Path.normalize(path)](https://nodejs.org/api/path.html#path_path_normalize_path)
- [Path.parse(path)](https://nodejs.org/api/path.html#path_path_parse_path)
- [Path.posix](https://nodejs.org/api/path.html#path_path_posix)
- Path.relative(from, to) (see above)
- Path.resolve([...paths]) (see above)
- [Path.sep](https://nodejs.org/api/path.html#path_path_sep)
- [Path.toNamespacedPath(path)](https://nodejs.org/api/path.html#path_path_tonamespacedpath_path)
- [Path.win32](https://nodejs.org/api/path.html#path_path_win32)
- `Path.unsafe = require('path');`

The non-wrapped methods and properties are generated automatically, so this
module will mirror the built-in path without being republished.
