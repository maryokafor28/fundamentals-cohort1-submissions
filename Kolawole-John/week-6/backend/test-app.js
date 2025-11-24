require('dotenv').config();
const express = require('express');
const app = express();
const PORT = 5000;
console.log('Creating server...');
app.get('/health', (req, res) => {
  res.json({ success: true });
});
app.listen(PORT, () => {
  console.log('SERVER STARTED ON PORT ' + PORT);
});
