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
        .setDescription("What word are you wondering about?")
        .setRequired(true)
    ),
  async execute(interaction) {
    const input = interaction.options.getString("word").split(" ")[0].trim().toLowerCase();
    if (matcher.hasMatch(input)) {
      await interaction.reply({
        content: "ayo what are u gettin at",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.deferReply();
      const found = output.some(
        (str) => typeof str === "string" && str.toLowerCase().includes(input)
      );
      await interaction.editReply({
        content: found
          ? `✅ Mov has said "${input}" before`
          : `❌ Mov has never said "${input}" before`,
        flags: MessageFlags.SuppressEmbeds,
        allowedMentions: {
          parse: [],
        },
      });
    }
  },
};
