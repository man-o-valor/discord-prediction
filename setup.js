const readline = require('readline').promises;
const fs = require('fs');
const parse = require('./parse');
const train = require('./train');

(async () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });


    const jsonPath = await rl.question("Input your index.json path: ");
    if (!fs.existsSync(jsonPath)) {
        console.warn('[!] Could not find file at specified path');
        rl.close();
        process.exit(0);
    }

    let index = require(jsonPath);

    const messagesPath = await rl.question("Input your message folder path: ");
    if (!fs.existsSync(messagesPath) || !fs.lstatSync(messagesPath).isDirectory()) {
        console.warn('[!] Could not find folder at specified path');
        rl.close();
        process.exit(0);
    }

    console.log("[+] Paths verified, attempting to parse data");
    console.log("[*] Loading configurations from config.json");

    rl.close();

    let config = {};

    if (!fs.existsSync('./config.json')) {
        console.warn('[!] Could not locate config.json, parsing with default values');
    } else {
        config = require('./config.json');
    }

    let filteredServers = config.filteredServers ?? [];
    let filteredThreads = config.filteredThreads ?? [];
    let filteredChannels = config.filteredChannels ?? [];
    let filterDms = config.filterDms ?? true;
    let filterGroupChats = config.filterGroupChats ?? true;

    config = {
        filteredServers,
        filteredThreads,
        filteredChannels,
        filterDms,
        filterGroupChats,
        jsonPath,
        messagesPath
    };

    parse(config, index);

    console.log("[*] Parsing done, moving on to training.")

    let data = [];

    if (!fs.existsSync('./output.json')) {
        console.warn('[!] Could not locate output.json, training terminated.');
        process.exit(0);
    } else {
        data = require('./output.json');
    }

    train(data);

    console.log("[+] Model successfully generated. Run 'node chat' to start a chat session with the model!")

})();
