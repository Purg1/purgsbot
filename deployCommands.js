require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.DISCORD_TOKEN;

// Set this to true to register commands **only in your guild (fast update)**
// Set to false to register commands globally (may take up to 1 hour to update)
const useGuildCommands = process.env.USE_GUILD_COMMANDS === 'true';

async function deployCommands() {
  try {
    const commands = [];
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      if (command.data) {
        commands.push(typeof command.data.toJSON === 'function' ? command.data.toJSON() : command.data);
        console.log(`Loaded command: ${command.data.name}`);
      } else {
        console.warn(`Skipping file without command data: ${file}`);
      }
    }

    const rest = new REST({ version: '10' }).setToken(token);

    console.log(`Deploying ${commands.length} command(s)...`);

    if (useGuildCommands) {
      // Guild commands (quick updates, dev mode)
      await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands }
      );
      console.log(`✅ Successfully deployed commands to guild ${guildId}`);
    } else {
      // Global commands (take up to 1 hour)
      await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands }
      );
      console.log(`✅ Successfully deployed global commands`);
    }
  } catch (error) {
    console.error('❌ Error deploying commands:', error);
  }
}

deployCommands();