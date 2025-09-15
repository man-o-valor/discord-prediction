let tokenize = require('./tokenize.js');
let data = require('./output.json');
let fs = require('fs');

let model = {};


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

    let sentence = tokenize(message);

    let wordMaxContext = sentence.length - 1;

    if (wordMaxContext > 0) {
        for (let i = 1; i <= wordMaxContext; i++) {
            parseTokens(sentence, i);
        }
    }
}

fs.writeFileSync("model.json", JSON.stringify(model, null, 2), "utf8");