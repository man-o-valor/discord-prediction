let tokenize = require('./tokenize.js');
const fs = require('fs')


if (!fs.existsSync('./model.json')) {
    console.warn('[!] Fatal error, could not locate a model.json file');
    process.exit(0);
}
let model = require('./model.json');


let defaultStartingPhrase = 'Hello there';

function getRandomToken(key) {
    if (!model[key]) return null;

    const object = model[key];
    const tokens = Object.keys(object);

   let total = 0;
    for (const token of tokens) {
        total += object[token];
    }

    let rand = Math.random() * total;

    for (const token of tokens) {
        rand -= object[token];
        if (rand <= 0) {
            return token;
        }
    }

    return tokens[tokens.length - 1];
}

function checkKey(key) {
    return model[key] ? true : false;
}



function generateTokens(context, startingPhrase) {
    startingPhrase = startingPhrase || defaultStartingPhrase; 
    let sentence = tokenize(startingPhrase);

    let maxTokens = 200;
    let tokens = 0;

    while (!sentence.join('').includes('<!end>') && tokens < maxTokens) {
        let dynamicContext = Math.min(context, sentence.length);
        let match = false;
        let seed;

        while (!match && dynamicContext > 0) {
            seed = sentence.slice(-dynamicContext).join('');

            const variants = [
                seed,
                seed.toLowerCase(),
                seed.trim(),
                seed.toLowerCase().trim(),
                " " + seed,
                " " + seed.toLowerCase()
            ];

            for (const variant of variants) {
                if (checkKey(variant)) {
                    seed = variant;
                    match = true;
                    break;
                }
            }

            if (!match) {
                dynamicContext--;
            }
        }

        if (!match || !(model[seed])) break;

        sentence.push(getRandomToken(seed));
        tokens++;
    }

    return sentence;
}

function stringifyOutput(array) {
    return array.join('').replaceAll('<!end>', '');
}

module.exports = { generateTokens, stringifyOutput };
