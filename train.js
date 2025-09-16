let tokenize = require('./tokenize.js');
let fs = require('fs');

function train(data) {

    let model = {};

    let totalTokens = 0;

    function parseTokens(array, context) {

        let contextLayer = (context < (array.length - 1)) ? context : (array.length - 1);

        let tokenNumber = array.length - contextLayer;

        if (contextLayer > 0) {

            for (let i = 0; i < tokenNumber; i++) {

                let contextString = array.slice(i, i + contextLayer).join('');
                let afterString = array[i + contextLayer];

                if (!(model[contextString])) {
                    model[contextString] = {};
                }

                if (!(model[contextString][afterString])) {
                    model[contextString][afterString] = 1;
                } else {
                    model[contextString][afterString]++;
                }

            }

        }

    }


    for (const message of data) {

        if (message.length > 1000) continue;

        let sentence = tokenize(message);

        totalTokens += sentence.length;

        let wordMaxContext = Math.min(sentence.length - 1, 5);

        if (wordMaxContext > 0) {
            for (let i = 1; i <= wordMaxContext; i++) {
                parseTokens(sentence, i);
            }
        }
    }

    console.log(`Training successful, ${totalTokens} tokens generated and trained upon.`);


    fs.writeFileSync("model.json", JSON.stringify(model), "utf8");

}

module.exports = train;
