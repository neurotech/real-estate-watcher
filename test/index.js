const test = require("tape");
const tapSpec = require("tap-spec-emoji");

test.createStream().pipe(tapSpec()).pipe(process.stdout);

test("fake test", function (t) {
  t.plan(1);
  let thing = true;
  t.true(thing);
});
