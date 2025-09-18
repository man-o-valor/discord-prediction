const readline = require('readline');
const { generateTokens, stringifyOutput } = require('./model');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('Chat session opened with model. You can exit by typing "exit".');

function ask() {
    rl.question("> ", (query) => {
        if (query.toLowerCase() === "exit") {
            rl.close();
            return;
        }
        console.log(`Model - ${stringifyOutput(generateTokens(3, query))}`);

        ask(); 
    });
}

ask();
