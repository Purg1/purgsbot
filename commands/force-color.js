const changeRoleColor = require('../utils/changeRoleColor');
const { forceColorCooldowns, level5RoleId, serverBoosterRoleId } = require('../config');

module.exports = {
  data: {
    name: 'force-color',
    description: 'Forces the rainbow role color to change to a random color (5 min cooldown)',
  },
  async execute(interaction, client) {
    const member = await interaction.guild.members.fetch(interaction.user.id);
    const hasPermission = member.roles.cache.has(level5RoleId) || member.roles.cache.has(serverBoosterRoleId);

    if (!hasPermission) {
      return interaction.reply({ content: '❌ You must be Level 5 or a Server Booster.', ephemeral: true });
    }

    const userId = interaction.user.id;
    const now = Date.now();
    const cooldown = 5 * 60 * 1000;

    if (forceColorCooldowns.has(userId)) {
      const lastUsed = forceColorCooldowns.get(userId);
      const remaining = cooldown - (now - lastUsed);
      if (remaining > 0) {
        const minutes = Math.ceil(remaining / 60000);
        return interaction.reply({ content: `⏳ Try again in ${minutes} minute(s).`, ephemeral: true });
      }
    }

    try {
      await changeRoleColor(client);
      forceColorCooldowns.set(userId, now);
      await interaction.reply('✅ Color changed successfully!');
    } catch (err) {
      console.error(err);
      await interaction.reply('❌ Failed to change color.');
    }
  }
};