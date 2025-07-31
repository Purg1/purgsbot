const InviteModel = require('../models/Invite');

module.exports = {
  data: {
    name: 'invites',
    description: 'Shows how many invites you have',
  },
  async execute(interaction) {
    const userId = interaction.user.id;
    const record = await InviteModel.findOne({ userId });
    const count = record?.invites || 0;

    await interaction.reply({
      content: `You have invited **${count}** member${count !== 1 ? 's' : ''}!`,
      ephemeral: true
    });
  }
};