const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const {
  RegExpMatcher,
  englishRecommendedTransformers,
  englishDataset,
} = require("obscenity");
const { generateTokens, stringifyOutput } = require("../../model");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mov")
    .setDescription("Prompt MarkOV to see what he says")
    .addStringOption((option) =>
      option
        .setName("word")
        .setDescription(
          "What word should MarkOV start on?"
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    const input = interaction.options.getString("word");
    await interaction.deferReply();

    const matcher = new RegExpMatcher({
      ...englishDataset.build(),
      ...englishRecommendedTransformers,
    });

    let markovresponse = await stringifyOutput(generateTokens(3, input));

    if (matcher.hasMatch(markovresponse) || /\bgoon\b/i.test(markovresponse)) {
      await interaction.editReply({
        content: "Check your language and try again",
        flags: MessageFlags.Ephemeral,
      });
      return;
    } else {
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
        try {
          await interaction.editReply({
            content:
              markovresponse +
              "\n-# text produced by MarkOV does not represent the views or messages of man-o-valor",
            flags: MessageFlags.SuppressEmbeds,
            allowedMentions: {
              parse: [],
            },
          });
        } catch (e) {
          await interaction.editReply(
            "The message MarkOV wrote for that prompt was blocked by automod 💀"
          );
        }
      }
    }
  },
};
