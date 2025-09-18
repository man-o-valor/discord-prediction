const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { generateTokens, stringifyOutput } = require('../../model');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mov")
    .setDescription("Prompt MarkOV to see what he says")
    .addStringOption((option) =>
      option
        .setName("word")
        .setDescription(
          "What word should MarkOV start on? CaSe SeNsItIvE, only the first word is used"
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    const input = interaction.options.getString("word").split(" ")[0].trim();
    await interaction.deferReply();
    let markovresponse = await stringifyOutput(generateTokens(3, input));

    if (markovresponse == null) {
      await interaction.editReply({
        content: "I ran into a problem with that word, try something else 🤔",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    console.log(
      interaction.user.username + ': "' + input + '": ' + markovresponse
    );
    if (markovresponse == input) {
      await interaction.editReply({
        content: "I don't have any data for that phrase 🤔",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      interaction.editReply({
        content:
          markovresponse +
          "\n-# text produced by MarkOV does not represent the views or messages of man-o-valor",
        flags: MessageFlags.SuppressEmbeds,
        allowedMentions: {
          parse: [],
        },
      });
    }
  },
};
