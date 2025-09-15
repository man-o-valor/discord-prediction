const fs = require('fs');

let output = [];
let channels = require('./index.json');

// Server ids to filter
let servers = ['server-id'];
// Channels and threads to filter
let channelsThreads = ['channel-or-thread-id'];

let ids = Object.keys(channels);

console.log(ids.length);

let messageNum = 0;


for (const id of ids) {

    const channelFile = `./Messages/c${id}/channel.json`;

    if (!fs.existsSync(channelFile)) continue;

    const channelData = JSON.parse(fs.readFileSync(channelFile, "utf8"));

    if (channelsThreads.includes(id)) continue;
    if (channelData.type === 'GROUP_DM' || channelData.type === 'DM') continue;
    if (!channelData.guild?.id || servers.includes(channelData.guild.id)) continue;

    const messageFile = `./Messages/c${id}/messages.json`;
    if (!fs.existsSync(messageFile)) continue;

    const messages = JSON.parse(fs.readFileSync(messageFile, "utf8"));
    for (const message of messages) {
        if (message.Contents) {
            output.push(message.Contents);
            messageNum++;
        }
    }
}


fs.writeFileSync("output.json", JSON.stringify(output, null, 2), "utf8");
console.log(`${messageNum} messages written`)

