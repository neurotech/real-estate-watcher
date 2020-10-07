const test = require("tape");

const filterAndMapListings = require("../filterAndMapListings.js");
const generateDiscordMessage = require("../generateDiscordMessage.js");

test.createStream().pipe(tapSpec()).pipe(process.stdout);

test("generateDiscordMessage - ", function (t) {
  t.plan(1);
  let thing = true;
  t.true(thing);
});
