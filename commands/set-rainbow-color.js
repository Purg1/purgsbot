const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { level5RoleId, serverBoosterRoleId, rainbowRoleId, serverId, forceColorCooldowns } = require('../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set-rainbow-color')
    .setDescription('Change the rainbow role color using a hex color code (Level 5 or boosters only)')
    .addStringOption(option =>
      option.setName('hex')
        .setDescription('Hex color code (e.g. #ff5733)')
        .setRequired(true)
    ),

  async execute(interaction) {
    const userId = interaction.user.id;
    const member = await interaction.guild.members.fetch(userId);
    const color = interaction.options.getString('hex');

    // Check for cooldown
    const cooldown = forceColorCooldowns.get(userId);
    if (cooldown && cooldown > Date.now()) {
      const timeLeft = Math.ceil((cooldown - Date.now()) / 1000);
      return interaction.reply({
        content: `⏳ You must wait ${timeLeft} more seconds before changing the color again.`,
        ephemeral: true
      });
    }

    // Role check
    if (
      !member.roles.cache.has(level5RoleId) &&
      !member.roles.cache.has(serverBoosterRoleId)
    ) {
      return interaction.reply({
        content: '🚫 Only Level 5 members or Server Boosters can use this command.',
        ephemeral: true
      });
    }

    // Validate hex color
    const isHex = /^#?([a-fA-F0-9]{6})$/.test(color);
    if (!isHex) {
      return interaction.reply({
        content: '❌ Please provide a valid 6-digit hex code (e.g. #ff0000).',
        ephemeral: true
      });
    }

    const hexColor = color.startsWith('#') ? color : `#${color}`;

    try {
      const role = await interaction.guild.roles.fetch(rainbowRoleId);
      if (!role) throw new Error('Rainbow role not found');
      await role.setColor(hexColor);

      // Set cooldown (5 minutes)
      forceColorCooldowns.set(userId, Date.now() + 5 * 60 * 1000);

      return interaction.reply({
        content: `✅ Rainbow role color changed to \`${hexColor}\`!`,
        ephemeral: false
      });
    } catch (err) {
      console.error(err);
      return interaction.reply({
        content: '❌ Failed to change color. Make sure I have permission to manage the rainbow role.',
        ephemeral: true
      });
    }
  },
};