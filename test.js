"use strict";
async function main() {
  let Path = require("./path.js").promises;

  function pass(err) {
    return err;
  }

  function reject(err) {
    if (!(err instanceof Error)) {
      throw new Error("expected error, got: " + JSON.stringify(err));
    }
  }

  function live(result) {
    if (result instanceof Error) {
      throw new Error("unexpected error");
    }
  }

  // the Promise nonsense is just a way to turn try/catch into
  // something that can be handled with functions

  //
  // Join
  //
  await Path.join("../foo", "bar").catch(pass).then(reject);
  await Path.join("foo", "../bar").catch(pass).then(reject);

  await Path.join("bar", "../../foo").catch(pass).then(reject);
  await Path.join("/bar", "../foo").catch(pass).then(reject);
  await Path.join("/bar", "../../foo").catch(pass).then(reject);
  await Path.join(".", "../foo").catch(pass).then(reject);
  await Path.join("../bar", "../foo").catch(pass).then(reject);
  await Path.join("../bar", "foo").catch(pass).then(reject);

  await Path.join("/foo", "../foo/bar").catch(pass).then(live);
  await Path.join("bar", "/foo").catch(pass).then(live);
  await Path.join("/", "../foo").catch(pass).then(live);
  await Path.join("/bar", "/foo").catch(pass).then(live);

  //
  // Resolve
  //
  await Path.resolve("bar", "../foo").catch(pass).then(reject);
  await Path.resolve("bar", "../../foo").catch(pass).then(reject);
  await Path.resolve("/bar", "../foo").catch(pass).then(reject);
  await Path.resolve("/bar", "../../foo").catch(pass).then(reject);
  await Path.resolve(".", "../foo").catch(pass).then(reject);
  await Path.resolve("../bar", "../foo").catch(pass).then(reject);
  await Path.resolve("bar", "/foo").catch(pass).then(reject);
  await Path.resolve("/bar", "/foo").catch(pass).then(reject);
  await Path.resolve("/bar", "foo", "../../baz").catch(pass).then(reject);
  await Path.resolve("/bar", "../../foo", "baz").catch(pass).then(reject);

  // not recommended, but not necessarily unsafe...
  await Path.resolve("../bar", "foo").catch(pass).then(live);
  await Path.resolve("/foo", "../foo/bar").catch(pass).then(live);
  await Path.resolve("/", "../foo").catch(pass).then(live);

  // safe
  await Path.resolve("foo", "bar").catch(pass).then(live);
  await Path.resolve("/bar", "foo", "../baz").catch(pass).then(live);

  //
  // Relative
  //
  await Path.relative("bar", "../foo").catch(pass).then(reject);
  await Path.relative("bar", "../../foo").catch(pass).then(reject);
  await Path.relative("/bar", "../foo").catch(pass).then(reject);
  await Path.relative("/bar", "../../foo").catch(pass).then(reject);
  await Path.relative(".", "../foo").catch(pass).then(reject);
  await Path.relative("../bar", "../foo").catch(pass).then(reject);
  await Path.relative("bar", "/foo").catch(pass).then(reject);
  await Path.relative("/bar", "/foo").catch(pass).then(reject);
  await Path.relative("/foo", "../foo/bar").catch(pass).then(reject);
  await Path.relative("foo", "bar").catch(pass).then(reject);
  await Path.relative("foo/bar", "../bar").catch(pass).then(reject);

  // not sure what the behavior should be here...
  await Path.relative("../bar", "foo").catch(pass).then(reject);

  // not recommended, but not necessarily unsafe...
  await Path.relative("foo", "foo/bar").catch(pass).then(live);
}

main()
  .then(function () {
    console.info("Pass");
  })
  .catch(function (err) {
    console.error("Fail:");
    console.error(err);
  });
