const mongoose = require('mongoose');

const inviteSchema = new mongoose.Schema({
  userId: String,
  invites: { type: Number, default: 0 },
});

module.exports = mongoose.model('Invite', inviteSchema);