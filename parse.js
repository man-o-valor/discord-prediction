const {
  RegExpMatcher,
  englishRecommendedTransformers,
  englishDataset,
} = require("obscenity");
const fs = require("fs");

let output = {};
let channels = require("./index.json");
const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

// Custom profanity regexes (add single-word entries here)
const customProfanity = /\bgoon\b/i;

// Server ids to filter
let servers = ["server-id"];
// Channels and threads to filter
let channelsThreads = ["channel-or-thread-id"];
// Separate data into seperate servers
const separateData = true;
// Exclude messages with profanity
const excludeProfanity = true;

let ids = Object.keys(channels);

let messageNum = 0;

for (const id of ids) {
  const channelFile = `./Messages/c${id}/channel.json`;

  if (!fs.existsSync(channelFile)) continue;

  const channelData = JSON.parse(fs.readFileSync(channelFile, "utf8"));

  if (channelsThreads.includes(id)) continue;
  if (channelData.type === "GROUP_DM" || channelData.type === "DM") continue;
  if (!channelData.guild?.id || servers.includes(channelData.guild.id))
    continue;

  const messageFile = `./Messages/c${id}/messages.json`;
  if (!fs.existsSync(messageFile)) continue;

  const messages = JSON.parse(fs.readFileSync(messageFile, "utf8"));
  for (const message of messages) {
    if (message.Contents) {
      if ((matcher.hasMatch(message.Contents) || customProfanity.test(message.Contents)) && excludeProfanity) continue;
      if (separateData) {
        if (!output[channelData.guild.id]) output[channelData.guild.id] = []
        output[channelData.guild.id].push(message.Contents);
      }
      output["all"].push(message.Contents);
      messageNum++;
    }
  }
}

fs.writeFileSync("output.json", JSON.stringify(output), "utf8");
console.log(`${messageNum} messages written`);
