let model = require('./model.json');
let tokenize = require('./tokenize.js');

let startingPhrase = 'Hello there';

let args = process.argv.slice(2);

if (args.length > 0) {
    startingPhrase = args[0];
}

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



function generateString(context) {
    let sentence = tokenize(startingPhrase);

    while (!sentence.join('').includes('<!end>')) {
        let dynamicContext = Math.min(context, sentence.length);
        let seed = sentence.slice(-dynamicContext).join('');

        while (!(model[seed]) && dynamicContext > 0) {
            dynamicContext -= 1;
            seed = sentence.slice(-dynamicContext).join('');
        }

        if (!(model[seed])) break;

        sentence.push(getRandomToken(seed));
    }

    return sentence;
}


function generateOutput() {
    return generateString(3).join('').replaceAll('<!end>', '');
}

console.log(generateOutput());



