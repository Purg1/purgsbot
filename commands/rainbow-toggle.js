const { rainbowRoleId, serverBoosterRoleId, level5RoleId } = require('../config');

module.exports = {
  data: {
    name: 'rainbow-toggle',
    description: 'Toggles the Rainbow role if eligible',
  },
  async execute(interaction) {
    const member = await interaction.guild.members.fetch(interaction.user.id);
    const hasBooster = member.roles.cache.has(serverBoosterRoleId);
    const hasLevel5 = member.roles.cache.has(level5RoleId);
    const hasRainbow = member.roles.cache.has(rainbowRoleId);

    if (!hasBooster && !hasLevel5) {
      return interaction.reply('You must be a Server Booster or have the Level 5 role to use this command.');
    }

    if (hasRainbow) {
      await member.roles.remove(rainbowRoleId);
      await interaction.reply('Rainbow role removed.');
    } else {
      await member.roles.add(rainbowRoleId);
      await interaction.reply('Rainbow role added.');
    }
  }
};