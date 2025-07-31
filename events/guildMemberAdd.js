const InviteModel = require('../models/Invite');
const { roleTiers, extraRoleId } = require('../config');

module.exports = async (client, member) => {
  const cachedInvites = client.invites.get(member.guild.id);
  const newInvites = await member.guild.invites.fetch();
  const usedInvite = newInvites.find(inv => inv.uses > (cachedInvites.get(inv.code) || 0));
  if (!usedInvite || !usedInvite.inviter) return;

  const inviterId = usedInvite.inviter.id;
  const inviterMember = await member.guild.members.fetch(inviterId).catch(() => null);
  if (!inviterMember) return;

  const record = await InviteModel.findOneAndUpdate(
    { userId: inviterId },
    { $inc: { invites: 1 } },
    { new: true, upsert: true }
  );

  for (const tier of roleTiers) {
    if (record.invites >= tier.invites && !inviterMember.roles.cache.has(tier.roleId)) {
      await inviterMember.roles.add(tier.roleId).catch(console.error);
      if (tier.invites === 12 && !inviterMember.roles.cache.has(extraRoleId)) {
        await inviterMember.roles.add(extraRoleId).catch(console.error);
      }
    }
  }

  const updatedInvites = new Map();
  newInvites.each(inv => updatedInvites.set(inv.code, inv.uses));
  client.invites.set(member.guild.id, updatedInvites);
};