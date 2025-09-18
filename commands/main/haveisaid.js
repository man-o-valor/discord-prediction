const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const output = require("../../output");
const {
  RegExpMatcher,
  englishRecommendedTransformers,
  englishDataset,
} = require("obscenity");

const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hasmovsaid")
    .setDescription("Has Mov said this before?")
    .addStringOption((option) =>
      option
        .setName("word")
        .setDescription("What word are you wondering about? CaSe SeNsItIvE")
        .setRequired(true)
    ),
  async execute(interaction) {
    const input = interaction.options.getString("word").split(" ")[0].trim();
    if (matcher.hasMatch(input)) {
      await interaction.reply({
        content: "ayo what are u gettin at",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.deferReply();
      const found = output.some(
        (str) => typeof str === "string" && str.includes(input)
      );

      let foundLeniantSubstring = null;
      if (!found) {
        for (const str of output) {
          if (typeof str === "string") {
            const lowerStr = str.toLowerCase();
            const lowerInput = input.toLowerCase();
            const idx = lowerStr.indexOf(lowerInput);
            if (idx !== -1) {
              foundLeniantSubstring = str.substr(idx, input.length);
              break;
            }
          }
        }
      }

      let replyContent;
      if (found) {
        replyContent = `✅ Mov has said \"${input}\" before`;
      } else if (foundLeniantSubstring) {
        replyContent = `✅ Mov has said something similar: \"${foundLeniantSubstring}\"`;
      } else {
        replyContent = `❌ Mov has never said \"${input}\" before`;
      }

      await interaction.editReply({
        content: replyContent,
        flags: MessageFlags.SuppressEmbeds,
        allowedMentions: {
          parse: [],
        },
      });
    }
  },
};
