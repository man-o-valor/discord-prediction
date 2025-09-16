const tokenize = require("./tokenize.js");
const data = require("./output.json");
const fs = require("fs");

let model = {};

function parseTokens(array, context, server) {
  let contextLayer = context < array.length - 1 ? context : array.length - 1;

  let tokenNumber = array.length - contextLayer;

  if (contextLayer > 0) {
    for (let i = 0; i < tokenNumber; i++) {
      let contextString = array.slice(i, i + contextLayer).join("");
      let afterString = array[i + contextLayer];

      if (!model[server]) {
        model[server] = {};
      }
      if (!model[server][contextString]) {
        model[server][contextString] = {};
      }

      if (!model[server][contextString][afterString]) {
        model[server][contextString][afterString] = 1;
      } else {
        model[server][contextString][afterString]++;
      }
    }
  }
}

for (const server of Object.keys(data)) {
  for (const message of data[server]) {
    if (message.length > 500) continue;

    let sentence = tokenize(message);

    let wordMaxContext = sentence.length - 1;

    if (wordMaxContext > 0) {
      for (let i = 1; i <= wordMaxContext; i++) {
        parseTokens(sentence, i, server);
      }
    }
  }
}

fs.writeFileSync("model.json", JSON.stringify(model), "utf8");
