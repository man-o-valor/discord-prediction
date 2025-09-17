let model = require("./model.json");
let tokenize = require("./tokenize.js");

async function markov(startingPhrase, serverId) {
  const TIMEOUT_MS = 5000;
  const _startTime = Date.now();

  function _timedOut() {
    return Date.now() - _startTime > TIMEOUT_MS;
  }
  function getRandomToken(key) {
    if (_timedOut()) return null;
    if (!model[serverId][key]) return null;

    const object = model[serverId][key];
    const tokens = Object.keys(object);

    let total = 0;
    for (const token of tokens) {
      if (_timedOut()) return null;
      total += object[token];
    }

    let rand = Math.random() * total;

    for (const token of tokens) {
      if (_timedOut()) return null;
      rand -= object[token];
      if (rand <= 0) {
        return token;
      }
    }

    return tokens[tokens.length - 1];
  }

  function generateString(context) {
    if (_timedOut()) return null;
    let sentence = tokenize(startingPhrase);

    while (!sentence.join("").includes("<!end>")) {
      if (_timedOut()) return null;
      let dynamicContext = Math.min(context, sentence.length);
      let seed = sentence.slice(-dynamicContext).join("");

      while (!model[serverId][seed] && dynamicContext > 0) {
        if (_timedOut()) return null;
        dynamicContext -= 1;
        seed = sentence.slice(-dynamicContext).join("");
      }

      if (!model[serverId][seed]) break;

      const token = getRandomToken(seed);
      if (!token) return null;
      sentence.push(token);
    }

    return sentence;
  }

  function generateOutput() {
    let str = generateString(3);
    if (str == null) return null;
    return str.join("").replaceAll("<!end>", "");
  }

  return generateOutput();
}

module.exports = { markov };
