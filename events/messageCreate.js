const { EmbedBuilder } = require('discord.js');
const { targetUserId, timeoutDuration } = require('../config');

module.exports = async (client, message) => {
  if (message.author.bot) return;

  const content = message.content.toLowerCase();
  if (message.content === '!levels' && message.author.id === '333907720295940097') {
    const embed = new EmbedBuilder()
      .setTitle('LEVEL 🔼 SYSTEM')
      .setDescription('Get rewarded for being active! Whether you\'re chatting or inviting others.')
      .addFields(
        { name: '🔓 Level 1', value: '• 500 messages or 1 invite' },
        { name: '🔓 Level 2', value: '• 1000 messages or 2 invites' },
        { name: '🔓 Level 3', value: '• 1500 messages or 3 invites' },
        { name: '🔓 Level 4 + Custom Role', value: '• 2000 messages or 6 invites' },
        { name: '🔓 Level 5 + Rainbow Role', value: '• 3000 messages or 12 invites' }
      )
      .setFooter({ text: '✨ Rainbow Role is also available through server boosting\n||Definitely not pay-to-win...||' })
      .setColor(0x5865F2);

    return message.channel.send({ embeds: [embed] });
  }

  if (message.author.id === targetUserId && content.includes('shawn mendes')) {
    try {
      const member = await message.guild.members.fetch(targetUserId);
      if (member.moderatable) {
        await member.timeout(timeoutDuration, 'Said "Shawn Mendes"');
      }
    } catch (err) {
      console.error('Timeout failed:', err);
    }
  }

  const triggers = {
    hello: 'Hey there!',
    help: 'nobody cares, kys',
    gay: 'faggot',
    gyat: 'mods, ban this guy',
    black: 'ni-',
    nigger: 'hey, you cant say that nigger',
    erm: 'what im saying bro',
    smash: 'freaky deaky nigger',
    would: 'man, stfu',
    goodbye: 'see ya later',
    forgot: 'stupid bitch',
    forgor: 'dumbass',
  };

  for (const word in triggers) {
    if (content.includes(word)) {
      try {
        await message.reply(triggers[word]);
        break;
      } catch (err) {
        console.error('Auto-response failed:', err);
      }
    }
  }
};