const { ActivityType } = require('discord.js');
const changeRoleColor = require('../utils/changeRoleColor');

module.exports = async (client) => {
  console.log('✅ Bot is online!');
  await client.user.setPresence({
    activities: [{ name: 'the colors change', type: ActivityType.Listening }],
    status: 'online',
  });

  for (const [guildId, guild] of client.guilds.cache) {
    const invites = await guild.invites.fetch();
    const codeUses = new Map();
    invites.each(inv => codeUses.set(inv.code, inv.uses));
    client.invites = client.invites || new Map();
    client.invites.set(guild.id, codeUses);
  }

  setInterval(() => changeRoleColor(client), 5 * 60 * 1000);
};