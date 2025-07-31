const moment = require('moment');
const { roleId, serverId } = require('../config');

module.exports = async function changeRoleColor(client) {
  const guild = await client.guilds.fetch(serverId);
  const role = await guild.roles.fetch(roleId);
  if (!role) return console.error('Role not found');

  const color = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  console.log(`Changing color to #${color} at ${moment().format('MMMM Do YYYY, h:mm:ss a')}`);
  await role.setColor(`#${color}`);
};