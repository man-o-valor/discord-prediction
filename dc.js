const { REST, Routes } = require("discord.js");
const { clientId, token } = require("./botconfig.json");
const fs = require("node:fs");
const path = require("node:path");

const commands = [];
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      let commandData = command.data.toJSON();
      commandData.integration_types = [0, 1];
      commandData.contexts = [0, 1, 2];
      commands.push(command.data.toJSON());
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

const rest = new REST().setToken(token);

(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} commands. I'll let you know when it's done! `
    );

    const data2 = await rest.put(Routes.applicationCommands(clientId), {
      body: commands,
    });
    console.log(`Successfully reloaded ${data2.length} global commands! :D`);
  } catch (error) {
    console.error(error);
  }
})();

/*

Use this to delete one command

rest.delete(Routes.applicationCommand(clientId, 'COMMAND ID'))
	.then(() => console.log('Successfully deleted application command'))
	.catch(console.error);

*/

/*

Use this to delete all guild commands

rest.put(Routes.applicationCommands(clientId), { body: [] })
	.then(() => console.log('Successfully deleted ALL OF THE guild commands, muahaha'))
	.catch(console.error);
*/
