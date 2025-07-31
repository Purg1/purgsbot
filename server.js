// server.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Bot is online!');
});

app.listen(PORT, () => {
  console.log(`✅ Web server running! Listening on port ${PORT}`);
});
