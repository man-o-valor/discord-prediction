const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { markov } = require("../../random.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mov")
    .setDescription("Prompt MarkOV to see what he says")
    .addStringOption((option) =>
      option
        .setName("input")
        .setDescription(
          "What word should MarkOV start on? CaSe SeNsItIvE, only the first word is used"
        )
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("global")
        .setDescription("Use data from all of Discord? Defaults to False")
    ),
  async execute(interaction) {
    const global = interaction.options.getBoolean("global") ?? false;
    const input = interaction.options.getString("input").split(" ")[0];
    let markovresponse = await markov(
      input,
      global ? "all" : interaction.guildId
    );
    console.log(
      interaction.user.username + ': "' + input + '": ' + markovresponse
    );
    if (markovresponse == input) {
      if (global) {
        await interaction.reply({
          content:
            "I don't have any data for that phrase in this server. Try again with global:True 🤔",
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content: "I don't have any data for that phrase 🤔",
          flags: MessageFlags.Ephemeral,
        });
      }
    } else {
      await interaction.reply({
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
