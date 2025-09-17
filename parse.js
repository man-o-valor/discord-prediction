const fs = require('fs');
const path = require('path');

function parse(config, channels) {

    let output = [];

    let identifiers = Object.keys(channels);

    console.log(`[*] Found ${identifiers.length} channels`);

    let messageNumber = 0;

    for (const id of identifiers) {

        const channelFile = path.join(config.messagesPath, `c${id}`, 'channel.json');

        if (!fs.existsSync(channelFile)) continue;

        const channelData = JSON.parse(fs.readFileSync(channelFile, "utf8"));

        if (config.filteredChannels.includes(id)) continue;
        if (config.filteredThreads.includes(id)) continue;
        if ((channelData.type === 'GROUP_DM' && config.filterGroupChats) ||
            (channelData.type === 'DM' && config.filterDms)) continue;
        if (!channelData.guild?.id || config.filteredServers.includes(channelData.guild.id)) continue;

        const messageFile = path.join(config.messagesPath, `c${id}`, 'messages.json');
        if (!fs.existsSync(messageFile)) continue;

        const messages = JSON.parse(fs.readFileSync(messageFile, "utf8"));

        for (const message of messages) {
            if (message.Contents) {
                output.push(message.Contents);
                messageNumber++;
            }
        }
    }

    console.log(`[+] Messages successfully parsed, ${messageNumber} messages found and saved`);


    fs.writeFileSync("output.json", JSON.stringify(output), "utf8");

}

module.exports = parse;






