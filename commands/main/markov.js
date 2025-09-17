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
    )
    .addBooleanOption((option) =>
      option
        .setName("global")
        .setDescription("Use data from all of Discord? Defaults to False")
    ),
  async execute(interaction) {
    let defaultwords = ["i", "I", "hi", "hello", "how", "but", "any"];
    const global = interaction.options.getBoolean("global") ?? false;
    if (global) {
      await interaction.deferReply({flags: MessageFlags.Ephemeral});
    }
    const input =
      interaction.options.getString("input").split(" ")[0] ??
      defaultwords[Math.floor(Math.random * defaultwords.length)];
    let markovresponse = await markov(
      input,
      global ? "all" : interaction.guildId
    );
    console.log(
      interaction.user.username + ': "' + input + '": ' + markovresponse
    );
    if (markovresponse == input) {
      await interaction.reply({
        content: "I don't have any data for that phrase 🤔",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      if (global) {
        await interaction.editReply({
          content: markovresponse,
          flags: [MessageFlags.SuppressEmbeds, MessageFlags.Ephemeral],
          allowedMentions: {
            parse: [],
          },
        });
      } else {
        await interaction.reply({
          content: markovresponse,
          flags: MessageFlags.SuppressEmbeds,
          allowedMentions: {
            parse: [],
          },
        });
      }
    }
  },
};
